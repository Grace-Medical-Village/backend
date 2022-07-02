FROM postgres:13 as base

ENV POSTGRES_PASSWORD=gmvc \
    POSTGRES_DB=gmvc \
    POSTGRES_USER=gmvc \
    PGDATA=/var/lib/postgresql/data


#
# DEV
#
FROM base as dev

COPY ./01-schema.sql /docker-entrypoint-initdb.d/
COPY ./02-data.sql /docker-entrypoint-initdb.d/
COPY ./03-mock.sql /docker-entrypoint-initdb.d/

#
# TEST
#
FROM base as test

COPY ./01-schema.sql /docker-entrypoint-initdb.d/
COPY ./02-data.sql /docker-entrypoint-initdb.d/
