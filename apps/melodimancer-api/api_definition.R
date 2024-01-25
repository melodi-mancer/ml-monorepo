# Install and load the plumber library
# install.packages("plumber")
# install.packages("Rcpp")

{
  library(Rcpp)
  library(plumber)
  library(jsonlite)
  library(lavaan)
  library(corrplot)
  library(ggplot2)
  library(psych)
  library(tidyr)
  library(gridExtra)
  #library(spotifyr)
}

# Custom functions
{
  # F1 turn json into R DF
  F1_json_df <- function(input_data) {
    df1 <- fromJSON(input_data)
    return(df1)
  }
  
  # F2 turns F1 output into summary statistics as R table and JSON
  F2_summary_table <- function(df1) {
    component_names <- c(
      "acousticness",
      "danceability",
      "liveness",
      "instrumentalness",
      "energy",
      "loudness",
      "speechiness",
      "tempo",
      "valence"
    )
    
    summary_table <- data.frame(
      Components = character(),
      Median = numeric(),
      Mean = numeric(),
      Q1 = numeric(),
      Q1low30pc = numeric(),
      Q1low20pc = numeric(),
      Q1low10pc = numeric(),
      Q1high30pc = numeric(),
      Q1high20pc = numeric(),
      Q1high10pc = numeric(),
      Q3 = numeric(),
      Q3low30pc = numeric(),
      Q3low20pc = numeric(),
      Q3low10pc = numeric(),
      Q3high30pc = numeric(),
      Q3high20pc = numeric(),
      Q3high10pc = numeric(),
      stringsAsFactors = FALSE
    )
    
    for (i in 1:length(component_names)) {
      column <- df1[[component_names[i]]]
      column_median <- median(column, na.rm = TRUE)
      column_mean <- mean(column, na.rm = TRUE)
      column_q1 <- quantile(column, 0.25, na.rm = TRUE)
      column_q1low30pc <- column_q1 * 0.7
      column_q1low20pc <- column_q1 * 0.8
      column_q1low10pc <- column_q1 * 0.9
      column_q1high30pc <- column_q1 * 1.3
      column_q1high20pc <- column_q1 * 1.2
      column_q1high10pc <- column_q1 * 1.1
      column_q3 <- quantile(column, 0.75, na.rm = TRUE)
      column_q3low30pc <- column_q3 * 0.7
      column_q3low20pc <- column_q3 * 0.8
      column_q3low10pc <- column_q3 * 0.9
      column_q3high30pc <- column_q3 * 1.3
      column_q3high20pc <- column_q3 * 1.2
      column_q3high10pc <- column_q3 * 1.1
      
      new_row <- list(
        Components = component_names[i],
        Median = column_median,
        Mean = column_mean,
        Q1 = column_q1,
        Q1low30pc = column_q1low30pc,
        Q1low20pc = column_q1low20pc,
        Q1low10pc = column_q1low10pc,
        Q1high30pc = column_q1high30pc,
        Q1high20pc = column_q1high20pc,
        Q1high10pc = column_q1high10pc,
        Q3 = column_q3,
        Q3low30pc = column_q3low30pc,
        Q3low20pc = column_q3low20pc,
        Q3low10pc = column_q3low10pc,
        Q3high30pc = column_q3high30pc,
        Q3high20pc = column_q3high20pc,
        Q3high10pc = column_q3high10pc
      )
      summary_table <- rbind(summary_table, new_row)
    }
    
    # Convert data frame to JSON
    summary_json <- toJSON(summary_table, pretty = TRUE)
    
    return(list(summary_table = summary_table, summary_json = summary_json))
  }
  
  # F3 turns 
  
}

#* @post /SummaryTable
#* Spotify top 100 as JSON
#* @param input_data Input top 100 as JSON
#* @serializer json
function(input_data) {
  result <- F1_json_df(input_data)
  SumTableAndJSON <- F2_summary_table(result)
  SumTableAndJSON$summary_table
  #SumTableAndJSON$summary_json
}
