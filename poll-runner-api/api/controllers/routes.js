const usersController = require('./usersController.js');
const pollsController = require('./pollsController.js');
const sessionsController = require('./sessionsController.js');

function routes(app) {
     // users
    // app.get('/users', usersController.getUsers);
    app.get('/users/me', usersController.getUser);
    app.post('/users', usersController.validateCreateUser, usersController.createUser);

    // polls
    app.get('/polls', pollsController.getPolls);
    app.post('/polls', pollsController.validateIsAdmin, pollsController.validateCreatePoll, pollsController.createPoll);
    app.delete('/polls/:id', pollsController.validateIsAdmin, pollsController.deletePoll);

    // sessions
    app.post('/sessions/auth', sessionsController.authenicateUser);
}

module.exports = function (app) {
    routes(app);
};