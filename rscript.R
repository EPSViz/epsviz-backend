library(jsonlite)
library(dplyr) 
library(tidyr)

x = function(data) {
  parsed.data <- fromJSON(data)
  return(parsed.data)
}

#x('{"name":"John", "age":30, "car":null}')
