docker build -t r-api -f Dockerfile .
docker run -p 8000:8000 r-api:latest