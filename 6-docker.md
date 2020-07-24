
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

- Docker containers are instances of...images

## NOTE: some files are missing from this directory....gobbled up in icloud??
## see `~/snacks-n-hangs` directory...clone from Heroku if need be

`docker build -t juliettet/snacks-n-hangs .` // packages a Dockerfile into an image

`docker run -p 49160:8080 -d juliettet/snacks-n-hangs` // starts a Docker image and turns it into a container

# Get container ID
$ ` docker ps `

# Print app output
$ ` docker logs <container id> `

# Example
  Running on http://0.0.0.0:8080

# If you need to go inside the container you can use the exec command:

` docker exec -it <container id> /bin/bash `

ie.,

` docker exec -it 172 /bin/bash `

` pwd`
` ls `
` ps aux ` //show list of running processes
` exit ` //quit shell and return to host system

# To test your app, get the port of your app that Docker mapped:

` docker ps `

# In the example above, Docker mapped the 8080 port inside of the container to the port 49160 on your machine.

   - returns:
   `  juliettet/snacks-n-hangs   "npm start"         2 minutes ago       Up 2 minutes        0.0.0.0:49160->8080/tcp   focused_curran`

   NOTE: to view in local browser, run:

   ` http://localhost:49160/ `

# Now you can call your app using curl (install if needed via: sudo apt-get install curl):

` curl -i localhost:49160 `


# Create repo and push it to Docker:

` docker push juliettet/snacks-n-hangs `


# Stop container:

` docker stop 172 `

# Stop Docker Machine:

` docker-machine stop default `

#Further learning:

https://docs.docker.com/compose/

# Cluster Managers:

https://docs.docker.com/engine/swarm/

* https://kubernetes.io/

https://mesos.apache.org/

# Networking capabilities:

 https://docs.docker.com/engine/userguide/networking/

# Treehouse course on Go language:

 https://teamtreehouse.com/library/go-language-overview

# Books:

https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592

https://www.amazon.com/Site-Reliability-Engineering-Production-Systems/dp/149192912X //How Google Runs Production Systems

# ENV Instructions

https://docs.docker.com/engine/reference/builder/#env

https://teamtreehouse.com/library/env-instructions

# User documentation:

https://docs.docker.com/engine/reference/builder/#user

https://teamtreehouse.com/library/user-instructions
