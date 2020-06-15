const server = require('../../connection.js');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');
const user = require('../models/user.js');

const createPollParams = Joi.object().keys({
    poll_name: Joi.string().trim().max(60).required(),
    questions: Joi.array().min(1).max(30).items(Joi.string().trim().lowercase().max(200)).single()
}).required();

const getPolls = (request, response) => {
    server.query('SELECT * FROM polls', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows);
    })
}

async function validateIsAdmin(request, response, next) {
    const token = request.headers.authorization.split(' ')[1];

    jwt.verify(token, sessionsController.privateKey, function (err, decoded) {
        if (!decoded) {
            return response.status(400).send([err]).end();
        }

        user.checkIfUserIsAdmin(decoded.id).then(function (isAdmin) {
            if (isAdmin) {
                return next();
            }
            return response.status(400).send(['You need to be an admin to access this feature.']).end();
        }).catch(function (error) { console.log(error); });
    });
}


async function validateCreatePoll(request, response, next) {
    const validationResult = Joi.validate(request.body, createPollParams, { abortEarly: false });

    if (validationResult.error) {
        const errors = [];

        for (let i = 0; i < validationResult.error.details.length; i++) {
            errors.push(validationResult.error.details[i].message);
        }

        return response.status(400).send(errors).end();
    }

    return next();
}

async function createPoll(request, response) {
    const { poll_name, questions } = request.body
    const id = uuidv4();

    server.query('INSERT INTO polls (id, poll_name, questions) VALUES ($1, $2, $3)', [id, poll_name, questions], (error, result) => {
        if (error) {
            throw error
        }
        return response.status(201).send({ msg: 'success' });
    })
}

async function deletePoll(request, response) {
    const id = request.params.id;

    server.query('DELETE FROM polls WHERE id = $1', [id], (error, result) => {
        if (error) {
            throw error
        }
        return response.status(201).send({ msg: 'success' });
    })
}

module.exports = {
    validateIsAdmin: validateIsAdmin,
    getPolls: getPolls,
    validateCreatePoll: validateCreatePoll,
    createPoll: createPoll,
    deletePoll: deletePoll
}