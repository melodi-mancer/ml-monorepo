FROM rocker/r-apt:bionic

RUN apt-get update && \
    apt-get install -y -qq \
    	r-cran-plumber \
    	r-cran-jsonlite \
    	r-cran-dplyr \
    	r-cran-stringr \
      r-cran-rcpp

RUN R -e 'install.packages("here")'

COPY api_definition.R /

# open port 80 to traffic
EXPOSE 80

CMD ["R", "-e", "library(plumber); pr <- plumb('/api_definition.R'); pr$run(host='0.0.0.0', port=8000)"]