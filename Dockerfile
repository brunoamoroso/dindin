FROM edgedb/edgedb:latest

ENV EDGEDB_SERVER_DATABASE=$EDGEDB_DBNAME
ENV EDGEDB_SERVER_USER=$EDGEDB_DBUSER
ENV EDGEDB_SERVER_PASSWORD=$EDGEDB_DBPASS
ENV EDGEDB_SERVER_PORT=5656

EXPOSE 5656