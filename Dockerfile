#
# BASE
#
FROM node:14-alpine as base

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --silent

COPY . .

#
# DEV
#
FROM base as dev

CMD ["npm", "run", "dev"]

#
# TEST
#
FROM base as test

CMD ["npm", "run", "test:coverage"]

#
# TEST DB
#
FROM postgres:13 as db

ENV POSTGRES_PASSWORD=gmvc \
    POSTGRES_DB=gmvc \
    POSTGRES_USER=gmvc \
    PGDATA=/var/lib/postgresql/data


FROM db as test-db

COPY ./db/index.sql /docker-entrypoint-initdb.d/
