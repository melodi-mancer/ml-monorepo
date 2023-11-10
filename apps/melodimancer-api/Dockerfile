FROM rocker/r-apt:bionic

RUN apt-get update && \
    apt-get install -y -qq \
    	r-cran-plumber \
    	r-cran-jsonlite \
    	r-cran-dplyr \
    	r-cran-stringr

RUN R -e 'install.packages("here")'

COPY api_definition.R /

# open port 80 to traffic
EXPOSE 80

# # install plumber
# ENV CRAN_REPO https://packagemanager.rstudio.com/all/__linux__/focal/338
# RUN Rscript -e 'install.packages(c("plumber"), repos = c("CRAN" = Sys.getenv("CRAN_REPO")))'


# when the container starts, start the main.R script
# CMD ["R", "-e", "source('/api_definition.R'); pr$run(host='0.0.0.0', port=8000)"]
CMD ["R", "-e", "library(plumber); pr <- plumb('/api_definition.R'); pr$run(host='0.0.0.0', port=8000)"]