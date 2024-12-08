# WORKBENCH TO OPTIMIZE PCA

#Comparison of performance between the following PCA functions
# `prcomp()` from the base R package
# `fa()` from the `psych` package
# `fa()` from the `psych` package with method set to `"ipca"`
# `fa()` from the `psych` package with method set to `"ppca"`
# `fa()` from the `psych` package with method set to `"gofa"`

# Packages
{
library(microbenchmark)
library(psych)
library(jsonlite)
library(tidyverse)
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

# Example use of microbench package
{
# Define the functions to compare
function1 <- function() {
  sum(1:1000)
}

function2 <- function() {
  Reduce(`+`, 1:1000)
}

# Measure performance using microbenchmark
results <- microbenchmark(
  function1 = function1(),
  function2 = function2(),
  times = 100L,
  control = list(warmup = 10L)
)

# Print the results
print(results)

# Plot the results (optional)
plot(results)
}

# Load Json sample as json_sample and keep specified columns using base R
{
json_sample <- fromJSON("output.json")
json_sample_cap <- json_sample[, 
                    c("Acousticness", 
                      "Danceability", 
                      "Liveness", 
                      "Instrumentalness", 
                      "Energy", 
                      "Loudness", 
                      "Speechiness", 
                      "Tempo", 
                      "Valence")]
colnames(json_sample) <- tolower(colnames(json_sample))
json_sample_nocap <- json_sample[, 
                    c("acousticness", 
                      "danceability", 
                      "liveness", 
                      "instrumentalness", 
                      "energy", 
                      "loudness", 
                      "speechiness", 
                      "tempo", 
                      "valence")]
#toJSON(json_sample_nocap)
}

# prcomp() function to create TEST1_prcomp
{
prcomp <- function(x){
    nrow <- dim(x)[1]
    # compute the covariance matrix of x
    cov_mat <- cov(x)
    # decompose it into a lower triangular matrix L and an eigen-vector matrix W
    eig_mat <- eigen(cov_mat, symmetric = TRUE)
    
    # return two components: the first one is the projection of each column on the 
    # principal component axis (1st column), the second one is orthogonal to it
    c1_vec <- as.data.frame(eig_mat$vectors[,1])
    c2_vec <- as.data.frame(eig_mat$vectors[,2])
    
    return (list(c1_vec, c2_vec))
}
TEST1_prcomp <- prcomp(json_sample)
}

# fa() function to create TEST2_fa
{
fa_function <- function(xx){
  fa(xx) |> (\(x) as.data.frame(as.matrix(x$loadings)))()
}
TEST2_fa <- fa_function(json_sample)
}

# Benchmark time
{
results <- microbenchmark(
  function1 = prcomp(json_sample),
  function2 = fa_function(json_sample),
  times = 100L,
  control = list(warmup = 10L)
)

# Print the results
print(results)

# Plot the results (optional)
plot(results)
}

# Comparison between F3 and F3_1
{
# F2 because F3 needs it
{
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
}
# F3
{
    F3_factor_analysis_varimax <- function(df1) {
    component_names <- names(required_audio_features)
  
    df1 <- df1 %>% select(one_of(component_names))
    Clusters1 <- df1[, component_names]
    CORClusters1 <- cor(Clusters1, use = "complete.obs")
    
    FA <- fa.parallel(CORClusters1, n.obs = nrow(Clusters1), plot=FALSE)
    PCA1 <- principal(CORClusters1, nfactors = FA$nfact, rotate = "varimax", scores = TRUE)
    
    Profile1 <- PCA1$loadings
    Profile1 <- Profile1[1:which(trimws(rownames(PCA1$loadings)) == "valence"), , drop = FALSE]
    Profile1 <- as.data.frame(Profile1)
    
    Profile1 <- Profile1 %>%
      mutate_all(~ case_when(
        . < -0.39 ~ -100, #-100 for negative + 'significant' correlation
        . > 0.39 ~ 100, #100 for postive + 'significant' correlation
        TRUE ~ 0 #0 for 'non-significant' correlation
      ))
    
    result <- F2_summary_table(df1)
    summary_table <- result
    summary_table <- summary_table %>%
      select(component, q1, q3)
    
    mutate_profile1 <- function(value, q1, q3) {
      case_when(
        value == 0 ~ NA_real_,
        value == -100 ~ q1,
        value == 100 ~ q3,
        TRUE ~ value
      )
    }
    
    # 
    
    Profile1 <- Profile1 %>%
      mutate(across(everything(), ~ mutate_profile1(.x, summary_table$q1, summary_table$q3), .names = "new_{.col}"))

    Profile1 <- Profile1 %>%
      select(contains("new_"))
    
    return(list(PCA1 = PCA1, profile = Profile1))
  }
}
F3_factor_analysis_varimax(json_sample_nocap)
# F3_1
{
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
F3_1_factor_analysis_varimax(json_sample)
}

# Benchmark time
{
results <- microbenchmark(
  function1 = F3_factor_analysis_varimax(json_sample_nocap),
  function2 = F3_1_factor_analysis_varimax(json_sample_nocap),
  times = 100L,
  control = list(warmup = 10L)
)

# Print the results
print(results)

# Plot the results (optional)
plot(results)
}

