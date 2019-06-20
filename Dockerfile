## Stage 1 (production base)
# Reminder: slim => Debian based => apk is Alpine based use apt-get
FROM node:10-slim as base
LABEL org.opencontainers.image.authors="Juliette Tworsey"
LABEL org.opencontainers.image.title="Node.js Dockerfile Ultimate Dockerfile"
LABEL org.opencontainers.image.licenses=MIT
LABEL com.bretfisher.nodeversion=$NODE_VERSION

ENV NODE_ENV=production
#ENV PORT 7777
EXPOSE 7777

WORKDIR /app
# Use wildcard * in case lock file does not yet exist
COPY package*.json  ./
# Double Ampersand => first command has to successfully install BEFORE the clean
# npm cache clean => make sure no left over files downloaded from NPM
# we use npm ci here so only the package-lock.json file is used in production
# npm config list => gets config info on how NPM & Node.js are set up => good for logging/debugging...
RUN npm config list
RUN npm ci \
    && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
CMD ["npm", "run", "start"]

# Stage 2 => Development
FROM base as dev
ENV NODE_ENV=development
COPY . .
# NOTE: these apt dependencies are only needed
# for testing. they shouldn't be in production
RUN apt-get update -qq && apt-get install -qy \
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends
RUN npm config list
#RUN npm install nodemon -g
RUN npm install --only=development \
    && npm cache clean --force
USER node
CMD ["npm", "run", "watch"]


# Stage 3 => Test
FROM dev as test
COPY . .
RUN npm audit
# Add security scanner
#NOTE: don't need to add certificates here w/apt-get => already done via dev stage
ARG MICROSCANNER_TOKEN
ADD https://get.aquasec.com/microscanner /
USER root
RUN chmod +x /microscanner
RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

# Stage 4 => remove ./tests => get rid of dev dependency node_modules
FROM test as pre-prod
RUN rm -rf ./tests rm -rf ./node_modules

# Stage 5 => leanest image possible
FROM base as prod
COPY --from=pre-prod /app /app
HEALTHCHECK CMD curl http://127.0.0.1/ || exit 1
USER node

# Build order:
# dev => test => prod

# Build dev:
# docker build -t ultimatenode:dev --target dev .
# or in this case, since `dev` is targeted in docker-compose, just run `docker-compose up`
# Build + run dev:
# docker build -t ultimatenode:dev --target dev . && docker run --init -p 80:80 ultimatenode:dev
# Run dev w/bind mount => not working...:
# docker run --init ultimatenode:dev -v $(pwd):/app ultimatenode:dev


# Build test:
# docker build -t ultimatenode:test --target test .
# Run test => run after `docker-compose up`:
# docker run --init ultimatenode:test


# Build prod:
# docker build -t ultimatenode:prod --target prod .
# Run prod:
# docker run --init ultimatenode:prod


# need the tini `--init` process for `ctrl + c`..stopping container..tini requires Alpine distro


# Build + run test:
# docker build -t ultimatenode:test --target test .
# Run test:
# docker run --init  ultimatenode:test
