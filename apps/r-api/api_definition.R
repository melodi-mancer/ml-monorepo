#TODO:
# Authentication: https://www.rplumber.io/articles/security.html
# Load balancing with faucet : https://github.com/ixpantia/faucet/blob/main/README.md

# popularity endpoint idea:
{
# receive an extra column with artist and/or track popularity
# analyze as factor?
# use as sorting algo for adventurousness button
# 
}

#Run packages
{
  library(plumber)
  library(jsonlite)
  library(lavaan)
  library(corrplot)
  library(ggplot2)
  library(psych)
  #library(snakecase)
  library(tidyr)
  library(dplyr)
  library(tibble)
  #library(gridExtra)
  #library(spotifyr)
}
#Run custom functions F1, F2, F3, F3_1
{
  # F1 turn json into R DF
  F1_json_df <- function(input_data) {
    df1 <- input_data
    return(df1)
  }
  
  # F2 turns F1 output into a list containing a summary statistics
  # as an R table (summary_table)
  F2_summary_table <- function(df1) {
    # empty DF to take data
    summary_table <- data.frame(
      component = character(),
      median = numeric(),
      mean = numeric(),
      q1 = numeric(),
      q1_low_30pc = numeric(),
      q1_low_20pc = numeric(),
      q1_low_10pc = numeric(),
      q1_high_30pc = numeric(),
      q1_high_20pc = numeric(),
      q1_high_10pc = numeric(),
      q3 = numeric(),
      q3_low_30pc = numeric(),
      q3_low_20pc = numeric(),
      q3_low_10pc = numeric(),
      q3_high_30pc = numeric(),
      q3_high_20pc = numeric(),
      q3_high_10pc = numeric(),
      stringsAsFactors = FALSE
    )
    
    # iterate over each component_name as a column to calculate values as rows
    # required_audio_features is taken from 'Reference models for the API requests'
    # which is one of the frames defined after these functions are
    for (component_name in names(required_audio_features)) {
      column <- df1[[component_name]]
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

      # after calculation and assignment to objects, turn into list
      new_row <- list(
        component = component_name,
        median = column_median,
        mean = column_mean,
        q1 = column_q1,
        q1_low_30pc = column_q1low30pc,
        q1_low_20pc = column_q1low20pc,
        q1_low_10pc = column_q1low10pc,
        q1_high_30pc = column_q1high30pc,
        q1_high_20pc = column_q1high20pc,
        q1_high_10pc = column_q1high10pc,
        q3 = column_q3,
        q3_low_30pc = column_q3low30pc,
        q3_low_20pc = column_q3low20pc,
        q3_low_10pc = column_q3low10pc,
        q3_high_30pc = column_q3high30pc,
        q3_high_20pc = column_q3high20pc,
        q3_high_10pc = column_q3high10pc
      )

      # bind up all the new_row iterations into a table
      summary_table <- rbind(summary_table, new_row, stringsAsFactors = FALSE)
    }

    return(summary_table)
  }
  
  # F3 turns JSON into list of PCA analysis and Profile
  F3_factor_analysis_varimax <- function(df1) {
    # keep only these columns as defined in required_audio_features
    # required_audio_features is defined under 
    component_names <- names(required_audio_features)
  
    # keep only columns that exist as names in component_names
    # component_names is defined under #Reference models for the API requests
    df1 <- df1 %>% select(one_of(component_names))
    # drop columns not defined in component_names
    Clusters1 <- df1[, component_names]
    CORClusters1 <- cor(Clusters1, use = "complete.obs")
    
    # Perform factor analysis
    # varimax: to simplify the structure of the loadings matrix
    # aims to make the loadings for each variable either very high or very low
    # in a single factor while keeping them close to zero in all other factors
    # Turned off plot with plot=FALSE
    FA <- fa.parallel(CORClusters1, n.obs = nrow(Clusters1), plot=FALSE)
    PCA1 <- principal(CORClusters1, nfactors = FA$nfact, rotate = "varimax", scores = TRUE)
    
    # Convert loadings to a data frame
    Profile1 <- PCA1$loadings
    # Cut off anything below "Valence" row
    Profile1 <- Profile1[1:which(trimws(rownames(PCA1$loadings)) == "valence"), , drop = FALSE]
    Profile1 <- as.data.frame(Profile1)
    
    # Prepare table for Spotify metrics using .4 as rule of thumb
    Profile1 <- Profile1 %>%
      mutate_all(~ case_when(
        . < -0.39 ~ -100, #-100 for negative + 'significant' correlation
        . > 0.39 ~ 100, #100 for postive + 'significant' correlation
        TRUE ~ 0 #0 for 'non-significant' correlation
      ))
    
    # Run Summary table function to get profile values as table
    result <- F2_summary_table(df1)
    summary_table <- result
    summary_table <- summary_table %>%
      select(component, q1, q3)
    
    # Quick function to replace values marked as strong correlations
    mutate_profile1 <- function(value, q1, q3) {
      case_when(
        value == 0 ~ NA_real_,
        value == -100 ~ q1,
        value == 100 ~ q3,
        TRUE ~ value
      )
    }
    
    # Use quick function to add columns with Q1 or Q3 values to be sent to Spotify API
    Profile1 <- Profile1 %>%
      mutate(across(everything(), ~ mutate_profile1(.x, summary_table$q1, summary_table$q3), .names = "new_{.col}"))
    
    #return(list(PCA1 = PCA1, FA = FA, num_factors = num_factors, factor_loadings = factor_loadings))
    
    #remove -100 100 columns by keeping new_ columns
    Profile1 <- Profile1 %>%
      select(contains("new_"))
    
    return(list(PCA1 = PCA1, profile = Profile1))
  }

  # F3_1 optimzed F3 that return Profile
  F3_1_factor_analysis_varimax <- function(df1) {
  #F3_1 performance improvements:
    # base-r to replace tidyverse
    # removed some minor redundancies
    # return only profile dataframe
  
    # keep only these columns as defined in required_audio_features
    component_names <- names(required_audio_features)
  
  # keep only columns that exist as names in component_names
  # component_names is defined under #Reference models for the API requests
    
    # Match column names case-insensitively
    matched_cols <- colnames(df1)[tolower(colnames(df1)) %in% tolower(component_names)]
    
    # Convert matched column names to lowercase in the data frame
    colnames(df1)[tolower(colnames(df1)) %in% tolower(component_names)] <- tolower(matched_cols)
    
    # Subset the data frame using the matched column names
    df1 <- df1[, tolower(component_names), drop = FALSE]
    
    # Create correlation matrix
    CORClusters1 <- cor(df1, use = "complete.obs")
    
  # Perform factor analysis
  # varimax: to simplify the structure of the loadings matrix
  # aims to make the loadings for each variable either very high or very low
  # in a single factor while keeping them close to zero in all other factors

    # only produce the recommended number of factors
    nfact <- fa.parallel(CORClusters1, n.obs = nrow(Clusters1), plot = FALSE)$nfact
    PCA1 <- principal(CORClusters1, nfactors = nfact, rotate = "varimax", scores = TRUE)
    
    # Convert loadings to a data frame
    Profile1 <- PCA1$loadings
    
    # Cut off anything below "Valence" row
    Profile1 <- Profile1[1:which(trimws(rownames(PCA1$loadings)) == "valence"), , drop = FALSE]
    Profile1 <- as.data.frame(Profile1)
    
    # Apply the transformation to all columns of Profile1
    Profile1[] <- apply(Profile1, 2, function(x) {
      ifelse(x < -0.39, -100,    #-100 for negative + 'significant' correlation
      ifelse(x > 0.39, 100, 0))  # 100 for positive + 'significant' correlation
    })
    
    # Run Summary table function to get profile values as table
    summary_table <- F2_summary_table(df1)
    summary_table <- summary_table[, c("component", "q1", "q3")]
    
    mutate_profile1 <- function(value, q1, q3) {
      ifelse(value == 0, NA_real_,
             ifelse(value == -100, q1,
                    ifelse(value == 100, q3, value)))
    }
    
    # Apply the mutate_profile1 function to each column in Profile1
    Profile1_new <- Profile1
    for (col in colnames(Profile1)) {
      Profile1_new[[paste0("new_", col)]] <- mapply(mutate_profile1, Profile1[[col]], 
                                                     MoreArgs = list(q1 = summary_table$q1, q3 = summary_table$q3))
    }
    
    # Subset the new columns that contain "new_"
    Profile1_new <- Profile1_new[, grep("new_", colnames(Profile1_new))]

    return(list(profile = Profile1_new))
  }
  
}
#API endpoint 3: Z-score to order the list
{
  F4_FactorNameNumberExtractor <- function(data) {
  # Convert list to data frame
  df <- as.data.frame(data[["profile"]], stringsAsFactors = FALSE)

  # Convert row names to a column
  df <- df %>%
    rownames_to_column(var = "row_name")
  
  # Remove "new_RC" from each column name
  df <- df %>%
    rename_with(~gsub("^new_RC", "", .), starts_with("new_RC"))
  
  # Reshape data frame to long format
  df_long <- df %>%
    pivot_longer(cols = -row_name, names_to = "factor", values_to = "value")
  
  # Filter out rows with NA or 0 values + drop value column
  df_filtered <- df_long %>%
    filter(!is.na(value) & value != 0) %>%
    select(-value)
  
  # Add a new column with names according to the column number and row name
  df_filtered <- df_filtered %>%
    mutate(new_column_name = gsub("_\\d+$", "", paste0(factor, "_", row_name)))
  
  # Extract the desired information
  desired_info <- df_filtered$new_column_name
  
  return(desired_info)
}
  
  F5_Zvalues <- function(data) {
    # Extract dataframe from the list
    df <- as.data.frame(data[["tracks"]])

    # Convert all columns except the first to numeric
    df <- df %>%
      mutate_at(vars(-1), as.numeric)

    # Calculate Z-values for all numeric columns except the first
    z_cols <- names(df)[-1]
    df <- df %>%
      mutate(across(all_of(z_cols), ~ (.-mean(., na.rm = TRUE))/sd(., na.rm = TRUE), .names = "{.col}_Z"))

    # Square negative Z-values
    df <- df %>%
      mutate(across(ends_with("_Z"), ~ ifelse(. < 0, .^2, .)))
    
    # Select only column 1 and the Z-value columns
    df <- df %>%
      select(1, ends_with("_Z"))
    
    # Remove "_Z" from the column names
    df <- df %>%
      rename_with(~gsub("_Z$", "", .), ends_with("_Z"))
    
    # Return the updated dataframe
    return(df)
  }
  
  F6_Sorted_List <- function(Z_DF, Columns_To_Keep) {
  # Make sure string comes through without empty
  Columns_To_Keep <- as.character(Columns_To_Keep)
  Columns_To_Keep <- Columns_To_Keep[Columns_To_Keep != ""]
  
  # Select columns based on Columns_To_Keep
  df <- Z_DF %>%
    select(1, matches(paste0(Columns_To_Keep, collapse = "|")))
  
  #ERROR ALTERNATIVE
  # Find the indices of columns to keep
  #columns_to_keep <- c(1, grep(paste0(Columns_To_Keep, collapse = "|"), names(Z_DF), ignore.case = TRUE))
  # Subset the data frame
  #df <- Z_DF[, columns_to_keep]
  
  # Calculate row totals excluding the first column
  df$Z_totals <- rowSums(df[, -1])
  
  # Sort the dataframe based on Z_totals
  df <- df[order(df$Z_totals), ]
  
  # Add a column with row numbers
  df$rownumbers <- seq_len(nrow(df))
  
  # Keep only the first column and the row numbers using select
  df <- select(df, 1, rownumbers)
  
  return(df)
}
}  
#Reference models for the API requests
{
  required_audio_features <- list(
    acousticness = 0,
    danceability = 0,
    liveness = 0,
    instrumentalness = 0,
    energy = 0,
    loudness = 0,
    speechiness = 0,
    tempo = 0,
    valence = 0
  )

  required_track_features <- list(
    trackId = 0,
    acousticness = 0,
    danceability = 0,
    liveness = 0,
    instrumentalness = 0,
    energy = 0,
    loudness = 0,
    speechiness = 0,
    tempo = 0,
    valence = 0
  )
  
required_endpoint3 <- list(
    profile = list(
      acousticness = 0,
      danceability = 0,
      liveness = 0,
      instrumentalness = 0,
      energy = 0,
      loudness = 0,
      speechiness = 0,
      tempo = 0,
      valence = 0
    ),
    tracks = list(
      list(
        trackId = 0,
        acousticness = 0,
        danceability = 0,
        liveness = 0,
        instrumentalness = 0,
        energy = 0,
        loudness = 0,
        speechiness = 0,
        tempo = 0,
        valence = 0
      )
    )
  )
}

#* @apiTitle Melodimancer Analysis API
#* @apiDescription API for performing statistical analysis on Spotify audio features
#* @apiTag Analysis Statistical Analysis

#* @post /summary_table
#* Perform statistical analysis on Spotify audio features and provide a summary
#* @param audio_features:[object]
#* @tag Analysis
#* @serializer json
function(audio_features = required_audio_features) {
  result <- F1_json_df(audio_features)
  summary_table <- F2_summary_table(result)

  # create the response model
  list (summary_table = summary_table)
}

#* @post /cfa
#* Profile through CFA analysis based on Spotify audio features
#* @param audio_features:[object]
#* @tag Analysis
#* @serializer json
function(audio_features = required_audio_features) {
  result <- F1_json_df(audio_features)
  profile_cfa <- F3_factor_analysis_varimax(result)
  # create the response model
  list(profile_cfa = profile_cfa$profile)
}

#* @post /cfa_1
#* Optimzed .1 version. Profile through CFA analysis based on Spotify audio features
#* @param audio_features:[object]
#* @tag Analysis
#* @serializer json
function(audio_features = required_audio_features) {
  result <- F1_json_df(audio_features)
  profile_cfa <- F3_1_factor_analysis_varimax(result)
  # create the response model
  list(profile_cfa = profile_cfa$profile)
}

#* @post /z_scored_lists
#* Ingest profile and track list and return list per factor, ordered by z-values closest to 0
#* @param data:object
#* @tag Analysis
#* @serializer json
function(data) {
  Columns_To_Keep <- F4_FactorNameNumberExtractor(data)
  Z_DF <- F5_Zvalues(data)
  most_average_sorted <- F6_Sorted_List(Z_DF, Columns_To_Keep)
  most_average_sorted
}


#' @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
}