needs(jsonlite)
needs(dplyr) 
needs(tidyr)

attach(input[[1]])

# df.earnings <- fromJSON(earnings)

cutoffdate = function(earnings) {
  df.nrows <- nrow(earnings)
  for(i in 1:df.nrows) {
    if(!is.na(earnings[i,3])) {
      return(earnings[i,1])  
    }
  }
  return(0)
  
}

#earnings

cutoffdate(earnings)

#earnings[1,1]