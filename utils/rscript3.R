library(needs)
needs(broom)

attach(input[[1]])

predictionSentiment = function(earnings, trends) {
  vector.data = getVectorData(earnings)
  df.trends = trends[[1]][[1]]
  prediction.month = as.POSIXct(vector.data[4])
  prediction.month.int = as.integer(format(prediction.month,"%m"))
  if (prediction.month.int == 1) {
    sentiment.month = 12
  } else {
    sentiment.month = prediction.month.int - 1
  }
  curr.row = -10
  curr.month.int = -10
  for (i in nrow(df.trends):1) {
    curr.month = substr(df.trends[i,3], 1, 3)
    curr.month.int = base::match(curr.month, month.abb)
    if (sentiment.month == curr.month.int) {
      curr.row = i
      break
    }
  }
  total.sentiment = 0
  counter = 0
  while (counter < 2) {
    total.sentiment = total.sentiment + as.integer(df.trends[curr.row, 6])
    curr.row = curr.row - 1
    curr.month2 = substr(df.trends[curr.row,3], 1, 3)
    curr.month2.int = base::match(curr.month2, month.abb)
    if (!(curr.month.int == curr.month2.int)) {
      curr.month.int = curr.month2.int
      counter = counter + 1
    }
  }
  return(cbind(total.sentiment, curr.row))
}

# getVectorData = function(earnings) {
#   df.nrows <- nrow(earnings)
#   for(i in 1:df.nrows) {
#     if(!is.na(earnings[i,3])) {
#       #return(earnings[i,1])  
#       cutoff.date = earnings[i,1]
#       no.quarters = df.nrows - i + 2
#       consensus.at.predict.quarter = earnings[i-1,2]
#       prediction.date = earnings[i-1,1]
#       return(c(cutoff.date, no.quarters, consensus.at.predict.quarter,prediction.date, i)) # if is.na(consensus), then prediction not ready yet.
#       #return(c(cutoff.date, no.quarters, consensus.at.predict.quarter))
#     }
#   }
#   return("error")
  
# }

getVectorData = function(earnings) {
  df.nrows <- nrow(earnings)
  for(i in 1:df.nrows) {
    if(!is.na(earnings[i,3])) {
      #return(earnings[i,1])  
      cutoff.date = earnings[i,1]
      no.quarters = df.nrows - i + 2
      consensus.at.predict.quarter = earnings[i-1,2]
      prediction.date = earnings[i-1,1]
      return(c(cutoff.date, no.quarters, consensus.at.predict.quarter, prediction.date, i)) # if is.na(consensus), then prediction not ready yet.
      #return(c(cutoff.date, no.quarters, consensus.at.predict.quarter))
    }
  }
  return("error")
  
}

historicalDataFrame = function(earnings, trends) { # date (quarters), actual eps, sentiment (aggregate 3 months)
  vector.data = getVectorData(earnings)
  earnings.curr.row = as.integer(vector.data[5])
  trends.curr.row = as.integer(predictionSentiment(earnings, trends)[2])
  df.trends = trends[[1]][[1]]
  curr.month = substr(df.trends[trends.curr.row, 3], 1, 3)
  total.quarters = min(as.numeric(vector.data[2]), 20)
  quarter.counter = 0 
  vec.date <- vector()
  vec.eps <- vector()
  vec.sentiment <- vector()
  #for each quarter.counter add earnings[earnings.curr.row, 1] epsreportdate, and earnings[earnings.curr.row, 3] actual eps and before going to next quarter.counter add the aggregate sentiment
  # columns (date, actual eps, quarter aggregate sentiment)
  while (quarter.counter < total.quarters) {
    #skip first month
    curr.month2 = substr(df.trends[trends.curr.row,3], 1, 3)
    while(curr.month == curr.month2) {
      trends.curr.row = trends.curr.row - 1
      if(trends.curr.row == 0) { #debug
        return(data.frame(vec.date, vec.eps, vec.sentiment))
      }
      curr.month2 = substr(df.trends[trends.curr.row,3], 1, 3)
    }
    curr.month = curr.month2
    curr.sentiment = 0
    counter = 0
    while (counter < 2) {
      curr.sentiment = curr.sentiment + as.integer(df.trends[trends.curr.row, 6])
      trends.curr.row = trends.curr.row - 1
      if(trends.curr.row == 0) { #debug
        return(data.frame(vec.date, vec.eps, vec.sentiment))
      }
      curr.month2 = substr(df.trends[trends.curr.row,3], 1, 3)
      if (!(curr.month == curr.month2)) {
        curr.month = curr.month2
        counter = counter + 1
      }
    }
    vec.date = append(vec.date, earnings[earnings.curr.row, 1])
    vec.eps = append(vec.eps, earnings[earnings.curr.row, 3])
    vec.sentiment = append(vec.sentiment, curr.sentiment)
    earnings.curr.row = earnings.curr.row + 1
    quarter.counter = quarter.counter + 1
  }
  return(data.frame(vec.date, vec.eps, vec.sentiment))
}

predict = function(earnings, trends) {
  # Get prediction date
  prediction.date = getVectorData(earnings)[4]
  consensus.eps = getVectorData(earnings)[3]
  # Get predictor sentiment value
  predictor.value = as.numeric(predictionSentiment(earnings, trends)[1])
  df.historical.data = historicalDataFrame(earnings, trends)
  # Separate the test data (latest quarter) from the training data

  df.historical.data <- df.historical.data[!is.na(df.historical.data$vec.eps),]


  model <- stats::lm(as.formula(vec.eps ~ vec.sentiment), data = df.historical.data)

  p.value = broom::glance(model)$p.value
  adj.r2 = broom::glance(model)$adj.r.squared

  vec.eps <- c(NA)
  vec.sentiment <- c(predictor.value)
  vec.date <- c(prediction.date)

  predictor <- data.frame(vec.eps,vec.sentiment,vec.date)
  
  result <- stats::predict(model, newdata = predictor, interval = "prediction")

  lower <- result[,2][1]
  fit <- result[,1][1]
  upper <- result[,3][1]
  return(cbind(prediction.date, consensus.eps, lower, fit, upper, p.value, adj.r2))
}

predict(earnings, trends) #this is for rscript3

