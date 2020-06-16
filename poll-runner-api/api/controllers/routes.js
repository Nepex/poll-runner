const usersController = require('./usersController.js');
const pollsController = require('./pollsController.js');
const activePollsController = require('./activePollsController.js');
const sessionsController = require('./sessionsController.js');

function routes(app) {
     // users
    app.get('/users/me', usersController.getUser);
    app.get('/users/active-polls/:id', usersController.getActivePollsByUserId);

    // users admin
    app.get('/users', usersController.validateIsAdmin, usersController.getUsers);
    app.post('/users', usersController.validateCreateUser, usersController.createUser);

    // polls
    app.get('/polls', pollsController.getPolls);
    app.get('/polls/:id', pollsController.getPollById);

    // polls admin
    app.post('/polls', usersController.validateIsAdmin, pollsController.validateCreatePoll, pollsController.createPoll);
    app.delete('/polls/:id', usersController.validateIsAdmin, pollsController.deletePoll);

    // active polls
    app.get('/active-polls/:id', activePollsController.getActivePollById);
    app.put('/active-polls/:id', activePollsController.validateUpdateActivePoll, activePollsController.updateActivePoll);

    // active polls admin
    app.post('/active-polls', usersController.validateIsAdmin, activePollsController.validateCreateActivePolls, activePollsController.createActivePolls);
    app.get('/active-polls', usersController.validateIsAdmin, activePollsController.getActivePolls);

    // sessions
    app.post('/sessions/auth', sessionsController.authenicateUser);
}

module.exports = function (app) {
    routes(app);
};