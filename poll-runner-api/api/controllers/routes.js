const usersController = require('./usersController.js');
const pollsController = require('./pollsController.js');
const activePollsController = require('./activePollsController.js');
const sessionsController = require('./sessionsController.js');

function routes(app) {
     // users
    // app.get('/users', usersController.getUsers);
    app.get('/users/me', usersController.getUser);
    app.get('/users', usersController.validateIsAdmin, usersController.getUsers);
    app.post('/users', usersController.validateCreateUser, usersController.createUser);

    // polls
    app.get('/polls', pollsController.getPolls);
    app.get('/polls/:id', pollsController.getPollById);
    app.post('/polls', usersController.validateIsAdmin, pollsController.validateCreatePoll, pollsController.createPoll);
    app.delete('/polls/:id', usersController.validateIsAdmin, pollsController.deletePoll);

    // active polls
    app.post('/active-polls', usersController.validateIsAdmin, activePollsController.validateCreatePolls, activePollsController.createPolls);

    // sessions
    app.post('/sessions/auth', sessionsController.authenicateUser);
}

module.exports = function (app) {
    routes(app);
};