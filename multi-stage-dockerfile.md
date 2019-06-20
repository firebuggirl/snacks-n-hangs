https://www.udemy.com/docker-mastery-for-nodejs/learn/lecture/13970520#overview

https://www.udemy.com/docker-mastery-for-nodejs/learn/lecture/13970520#overview

- Added Tini to images so that containers will receive shutdown signals

- enable/use Buildkit w/ Tini on `test` version => run above command w/ additional env variable below:

` DOCKER_BUILDKIT=1 docker build --build-arg=MICROSCANNER_TOKEN=$MICROSCANNER -t snacksnhangs:test --target test . `

` docker run snacksnhangs:test `

- Build `production` version w/ Tini + Buildkit:

    - note: builds all stages => needs `test` output to get the files => make sure to add `user root` to test stage, otherwise will encounter chmod issue(s)

` DOCKER_BUILDKIT=1 docker build --build-arg=MICROSCANNER_TOKEN=$MICROSCANNER -t snacksnhangs:prod --target prod . `  

` docker run snacksnhangs:prod `

` ctrl + c `//can stop container w/ Tini


` docker image ls
`

- note varying sizes of images => prod will be smaller


- in separate shell:

` docker-compose up
`

` docker run snacksnhangs:dev
`

- Rebuild + get rid of cache

` docker-compose build
`


- vote => localhost:5000

- result => localhost:5001

` docker run -it snacksnhangs:prod bash `

- note how now nodemon is gone...image = ligher for prod

` ls node_modules/.bin `

- from project directory:

` docker-compose exec result ./tests/tests.sh `



- Enable the non-root node user for all dev/prod images:

` DOCKER_BUILDKIT=1 docker build --build-arg=MICROSCANNER_TOKEN=$MICROSCANNER -t snacksnhangs:prod --target prod . `  

` docker run snacksnhangs:prod `

    - Error: listen EACCES 0.0.0.0:80

    - NOTE: in Linux => cannot run non-root applications on low ports => need to be root to have permissions to run port 80  

    - change/EXPOSE/PORT to 8080
