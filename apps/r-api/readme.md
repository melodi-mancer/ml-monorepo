# Run docker container locally
1. clone the repo
git clone git@github.com:valkov/r-api.git

2. install docker..

3. build docker image
docker build -t r-api -f Dockerfile .

4. run docker image
docker run -p 8000:8000 r-api:latest

---
# To make your changes public on DigitalOcean 
1. ssh root@206.81.18.129 (your ssh token to be added to Droplet instance)
2. cd r-api
3. git pull
4. docker build -t r-api -f Dockerfile .
5. docker run -p 8000:8000 r-api:latest

## result
http://206.81.18.129:8000/random_text?l=20

# To publish your changes
docker build --no-cache -t valentinkovalski/api:latest .
docker push valentinkovalski/r-api:latest (it's a public repo at the moment)
redeploy on digital ocean(go to the website/actions/force rebuild and redeploy)