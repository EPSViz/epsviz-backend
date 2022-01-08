needs(jsonlite)
needs(dplyr) 
needs(tidyr)
needs(anytime)
needs(broom)
needs(stats)


log.path <- "log.txt"

attach(input[[1]])

# # df.earnings <- fromJSON(earnings)



getVectorData = function(earnings) {
  df.nrows <- nrow(earnings)
  for(i in 1:df.nrows) {
    if(!is.na(earnings[i,3])) {
      #return(earnings[i,1])  
      cutoff.date = earnings[i,1]
      no.quarters = df.nrows - i + 2
      consensus.at.predict.quarter = earnings[i-1,2]
      prediction.date = earnings[i-1,1]
      return(c(cutoff.date, no.quarters, consensus.at.predict.quarter,prediction.date, i)) # if is.na(consensus), then prediction not ready yet.
      #return(c(cutoff.date, no.quarters, consensus.at.predict.quarter))
    }
  }
  return("error")
  
}

# aggregatetest = function(earnings, trends) {
#   df.trends = trends[[1]][[1]]
#   extracted.month <- substr(df.trends[1,3], 1, 3) # string "May 5, 2019"
#   extracted.month.int = base::match(extracted.month, month.abb)
#   cutoff.date = as.POSIXct(getVectorData(earnings)[1]) # "2019-08-01"
#   cutoff.date.int = as.integer(format(cutoff.date,"%m"))
#   return(extracted.month.int + cutoff.date.int)
# }

predictionReady = function(earnings, trends) {
  if (nrow(earnings) <= 5) {
    return(FALSE)
  }
  vector.data = getVectorData(earnings)
  df.trends = trends[[1]][[1]]
  trends.nrows = nrow(df.trends)
  latest.trend.date = df.trends[trends.nrows, 3] # string "May 5, 2019"
  prediction.date = vector.data[4] # "2019-08-01"

  if ("-" == vector.data[3]) {
    return(FALSE)
  } else if (as.numeric(difftime(anytime(latest.trend.date), anytime(prediction.date), units = "days")) >= 30) {#if latest trend date is more than 1 month less than prediction date, then it is false
    return(FALSE)
  } else {
    return(TRUE)
  }
}



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

predictionReady(earnings, trends) #this is for rscript, returns true or false
#historicalDataFrame(earnings, trends) #this is for rscript2, returns the historical data frame




