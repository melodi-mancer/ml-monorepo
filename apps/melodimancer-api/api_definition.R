#plumber.R
library(plumber)
install.packages("Rcpp")

generate_random_text <- function(length) {
  # Define the character set
  characters <- c(letters, LETTERS, 0:9, "!@#$%^&*()_-+=<>?")
  
  # Generate random text of the specified length
  random_text <- paste(sample(characters, length, replace = TRUE), collapse = "")
  
  return(random_text)
}

# Generate and print random text of length 10
random_text <- generate_random_text(10)

#* @get /random_text
#* @param l
function(l) {
  generate_random_text(l)
}