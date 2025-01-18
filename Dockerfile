FROM edgedb/edgedb:latest

ENV EDGEDB_SERVER_DEFAULT_BRANCH=$EDGEDB_SERVER_DEFAULT_BRANCH
ENV EDGEDB_SERVER_USER=$EDGEDB_SERVER_USER
ENV EDGEDB_SERVER_PASSWORD=$EDGEDB_SERVER_PASSWORD
ENV EDGEDB_SERVER_PORT=5656
ENV EDGEDB_SERVER_TLS_CERT_FILE=./TLS_CERT
ENV EDGEDB_SERVER_TLS_KEY_FILE=./TLS_KEY

EXPOSE 5656