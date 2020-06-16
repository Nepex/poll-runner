const server = require('../../connection.js');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');

const createActivePollsParams = Joi.array().items({
    poll_id: Joi.string().trim().max(60).required(),
    user_id: Joi.string().trim().max(60).required(),
    responses: Joi.array().min(1).max(30).items(Joi.boolean().allow(null)).single().required(),
    last_updated: Joi.string().trim().max(60).required(),
}).required();

const updateActivePollParams = Joi.object().keys({
    id: Joi.string().trim().max(60).required(),
    poll_id: Joi.string().trim().max(60).required(),
    user_id: Joi.string().trim().max(60).required(),
    status: Joi.string().trim().max(20).required(),
    responses: Joi.array().min(1).max(30).items(Joi.boolean().allow(null)).single().required(),
    last_updated: Joi.string().trim().max(60).required(),
}).required();


const getActivePolls = (request, response) => {
    server.query('SELECT * FROM active_polls', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows);
    })
  }
  

async function getActivePollById(request, response) {
    const id = request.params.id;

    server.query('SELECT * FROM active_polls WHERE id = $1', [id], (error, result) => {
        if (error) {
            throw error
        }

        if (result.rows.length > 0) {
            return response.status(201).json(result.rows[0]);
        } else {
            return response.status(400).send(['That poll doesn\'t exist']).end();
        }
    })
}

async function validateCreateActivePolls(request, response, next) {
    const validationResult = Joi.validate(request.body, createActivePollsParams, { abortEarly: false });

    if (validationResult.error) {
        const errors = [];

        for (let i = 0; i < validationResult.error.details.length; i++) {
            errors.push(validationResult.error.details[i].message);
        }

        return response.status(400).send(errors).end();
    }

    return next();
}

async function createActivePolls(request, response) {
    let transport = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: '587',
        service: "hotmail",
        auth: {
            user: "pollrunner123@hotmail.com",
            pass: "testtesttest123"
        }
    });

    for (let i = 0; i < request.body.length; i++) {
        const { poll_id, user_id, responses, last_updated } = request.body[i];

        // Insert poll
        const id = uuidv4();
        server.query('INSERT INTO active_polls (id, poll_id, user_id, responses, last_updated) VALUES ($1, $2, $3, $4, $5)', [id, poll_id, user_id, responses, last_updated], (error, result) => {
            if (error) {
                throw error
            }
        })

        // Get user to send email to
        server.query('SELECT * FROM users WHERE id = $1', [user_id], (error, result) => {
            let user;

            if (result.rows.length > 0) {
                user = result.rows[0];

                const message = 'Please visit the following link to take your poll: <a href="http://localhost:4200/take-poll?id=' + id + '&user_id=' + user_id + '&poll_id=' + poll_id + '" target="_blank">Click me</a>';

                const email = {
                    from: '"Poll Runner" <pollrunner123@hotmail.com>',
                    to: user.email,
                    subject: 'You\'ve received a new Poll from Poll Runner!',
                    html: message
                };

                // timeout so my email provider doesn't freak out
                setTimeout(function () {
                    transport.sendMail(email, function (err, info) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }, 1000 + i * 1000);
            }
        })

        if (i + 1 === request.body.length) {
            return response.status(200).send({ msg: 'success' });
        }
    }
}


async function validateUpdateActivePoll(request, response, next) {
    const validationResult = Joi.validate(request.body, updateActivePollParams, { abortEarly: false });

    if (validationResult.error) {
        const errors = [];

        for (let i = 0; i < validationResult.error.details.length; i++) {
            errors.push(validationResult.error.details[i].message);
        }

        return response.status(400).send(errors).end();
    }

    return next();
}

const updateActivePoll = (request, response) => {
    const { id, poll_id, user_id, responses, status, last_updated } = request.body
    server.query(
        'UPDATE active_polls SET poll_id = $1, user_id = $2, responses = $3, status = $4, last_updated = $5 WHERE id = $6',
        [poll_id, user_id, responses, status, last_updated, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send({ msg: 'success' });
        });

}

module.exports = {
    getActivePolls: getActivePolls,
    getActivePollById: getActivePollById,
    validateCreateActivePolls: validateCreateActivePolls,
    createActivePolls: createActivePolls,
    validateUpdateActivePoll: validateUpdateActivePoll,
    updateActivePoll: updateActivePoll
}