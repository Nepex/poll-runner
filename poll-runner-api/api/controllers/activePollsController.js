const server = require('../../connection.js');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');

const createPollsParams = Joi.array().items({
    poll_id: Joi.string().trim().max(60).required(),
    user_id: Joi.string().trim().max(60).required(),
    responses: Joi.array().min(1).max(30).items(Joi.boolean().allow(null)).single().required(),
    last_updated: Joi.string().trim().max(60).required(),
}).required();


async function validateCreatePolls(request, response, next) {
    const validationResult = Joi.validate(request.body, createPollsParams, { abortEarly: false });

    if (validationResult.error) {
        const errors = [];

        for (let i = 0; i < validationResult.error.details.length; i++) {
            errors.push(validationResult.error.details[i].message);
        }

        return response.status(400).send(errors).end();
    }

    return next();
}

async function createPolls(request, response) {
    for (let i = 0; i < request.body.length; i++) {
        const { poll_id, user_id, responses, last_updated } = request.body[i]
        const id = uuidv4();

        server.query('INSERT INTO active_polls (id, poll_id, user_id, responses, last_updated) VALUES ($1, $2, $3, $4, $5)', [id, poll_id, user_id, responses, last_updated], (error, result) => {
            if (error) {
                throw error
            }
        })

        if (i + 1 === request.body.length) {
            return response.status(201).send({ msg: 'success' });
        }
    }
}

module.exports = {
    validateCreatePolls: validateCreatePolls,
    createPolls: createPolls
}