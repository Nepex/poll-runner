const server = require('../../connection.js');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');

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
                    transport.sendMail(email, function (err, info) { console.log(err); });
                }, 1000 + i * 1000);
            }
        })

        if (i + 1 === request.body.length) {
            response.status(200).send({ msg: 'success' });
        }
    }
}

module.exports = {
    validateCreatePolls: validateCreatePolls,
    createPolls: createPolls,
}