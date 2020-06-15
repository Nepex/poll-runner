# Poll Runner Front End Test

## Backend Instructions

Install Node.JS/NPM, PostgreSQL, and pgAdmin4.
Set 'postgres' user password to 'root' and port to 5432 if not already set.

Open pgAdmin4.

Create 'poll_runner' database or run create-db.sql (located in poll-runner-api/create-db/) in query tool.

Run create-tables.sql (located in poll-runner-api/create-db/) in query tool to create required tables.

CD into /poll-runner-api and run `npm i` then `node index.js`

## Frontend instructions

Run `npm i -g @angular/cli`

Run `ng serve` while in /poll-runner-app directory

Navigate to `localhost:4200`
