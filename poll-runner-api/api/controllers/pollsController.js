const server = require('../../connection.js');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');
const user = require('../models/user.js');
const jwt = require('jsonwebtoken');
const sessionsController = require('./sessionsController.js');

const createPollParams = Joi.object().keys({
    poll_name: Joi.string().trim().max(60).required(),
    questions: Joi.array().min(1).max(30).items(Joi.string().trim().lowercase().max(200)).single().required()
}).required();

const getPolls = (request, response) => {
    server.query('SELECT * FROM polls  ORDER BY poll_name ASC', (error, results) => {
        if (error) {
            return response.status(400).send(['Error loading data']).end();
        }
        response.status(200).json(results.rows);
    })
}

async function getPollById(request, response) {
    const id = request.params.id;

    server.query('SELECT * FROM polls WHERE id = $1', [id], (error, result) => {
        if (error) {
            return response.status(400).send(['Error loading data']).end();
        }

        if (result.rows.length > 0) {
            return response.status(201).json(result.rows[0]);
        } else {
            return response.status(400).send(['That poll doesn\'t exist']).end();
        }
    })
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
            return response.status(400).send(['Error loading data']).end();
        }
        return response.status(201).send({ msg: 'success' });
    })
}

async function deletePoll(request, response) {
    const id = request.params.id;

    server.query('DELETE FROM polls WHERE id = $1', [id], (error, result) => {
        if (error) {
            return response.status(400).send(['Error loading data']).end();
        }
        return response.status(201).send({ msg: 'success' });
    })
}

module.exports = {
    getPolls: getPolls,
    getPollById: getPollById,
    validateCreatePoll: validateCreatePoll,
    createPoll: createPoll,
    deletePoll: deletePoll
}