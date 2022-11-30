# Job management challenge solution

There is a backend written in Node with Express, a frontend using Node and
Create React App, a MySQL 8 database, an Nginx reverse proxy and PHPMyAdmin
for examining the database. All containers run in Docker with Docker Compose.

There is a makefile in the root directory containing the commands necessary
to start, stop and interact with the containers. If you're not using a machine
with `make` installed, please see the command definitions in `Makefile`.

To start the containers:

`make up`

For convenience, the database is migrated and seeded and the node containers
have their packages reinstalled on each startup, so you will need to wait for
a few moments for the containers to start. You can see the progress with:

`make logs`.

Once you can see in the log that both the frontend and backend containers are
listening for incoming requests, you can view the application by visiting:

http://locahost

The database can be viewed by visiting:

http://localhost:8080

Once you have finished, you can stop the containers with:

`make down`