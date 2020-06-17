# Poll Runner Front-End Coding Project

## Backend Instructions

Install Node.JS, PostgreSQL, and pgAdmin4

Set your postgres config to user: `postgres`, password: `root`, port: `5432` (or set to your config in poll-runner-api/connection.js)

Open pgAdmin

Create 'poll_runner' database or run `poll-runner-api/create-db/create-db.sql` in query tool

Run `poll-runner-api/create-db/create-tables.sql` in query tool to create required tables, also inserts the admin account

Run `npm i` then `node index.js` while in /poll-runner-api directory

## Frontend Instructions

Run `npm i -g @angular/cli`

Run `ng serve` while in /poll-runner-app directory

Navigate to `localhost:4200` in a browser

If you use other angular apps with ngx-webstorage on localhost:4200, the API may crash. Clear local storage to fix (Chrome: F12>Application>Local Storage>Delete ngx-webstorage|token), then rerun `node index.js`.

## Usage

1.) Create some users (with valid emails if you want notifications), comment out auto login function in signup component if you want to create a lot of users quickly

2.) Log into admin (user:admin@example.com, password:password)

3.) Use poll management tools to create/send polls

4.) Log into user accounts, take polls

5.) Log back into admin to view results

## Known Issues

Poll email notifications may get sent to spam folder
