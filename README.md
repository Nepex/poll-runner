# Poll Runner Front-End Coding Project

## Backend Instructions

Install Node.JS/NPM, PostgreSQL, and pgAdmin4.

Set 'postgres' user password to 'root' and port to 5432 if not already set (or set to your config in connection.js).

Open pgAdmin4.

Create 'poll_runner' database or run create-db.sql (located in poll-runner-api/create-db/) in query tool.

Run create-tables.sql (located in poll-runner-api/create-db/) in query tool to create required tables, also inserts the admin account.

CD into /poll-runner-api and run `npm i` then `node index.js`

## Frontend Instructions

Run `npm i -g @angular/cli`

Run `ng serve` while in /poll-runner-app directory

Navigate to `localhost:4200` in a browser

## Usage

Create some users (with valid emails if you want notifications)

Log into admin (user:admin@example.com, password:password)

Use poll management tools to create/send polls

Log into user accounts, take polls

Log back into admin to view results

## Known Issues

Poll email notifications may get sent to spam folder
