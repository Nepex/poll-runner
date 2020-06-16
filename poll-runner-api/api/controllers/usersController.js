const server = require('../../connection.js');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const Joi = require('joi');
const _ = require('underscore');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const sessionsController = require('./sessionsController.js');

const createUserParams = Joi.object().keys({
  first_name: Joi.string().trim().max(25).required(),
  last_name: Joi.string().trim().max(25).required(),
  email: Joi.string().lowercase().email().trim().max(60).required(),
  password: Joi.string().trim().min(5).max(255).required()
}).required();

const getUsers = (request, response) => {
  server.query('SELECT * FROM users ORDER BY last_name ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

async function getUser(request, response) {
  const token = request.headers.authorization.split(' ')[1];

  jwt.verify(token, sessionsController.privateKey, function (err, decoded) {
    if (!decoded) {
      return response.status(400).send([err]).end();
    }

    server.query('SELECT * FROM users WHERE id = $1', [decoded.id], (error, results) => {
      if (error) {
        throw error
      }

      const user = results.rows[0];
      delete user.password
      response.status(200).json(user);
    });
  });
}

async function getActivePollsByUserId(request, response) {
  const id = request.params.id;

  server.query('SELECT * FROM active_polls WHERE user_id = $1', [id], (error, result) => {
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

async function validateCreateUser(request, response, next) {
  const { email } = request.body
  const validationResult = Joi.validate(request.body, createUserParams, { abortEarly: false });

  if (validationResult.error) {
    const errors = [];

    for (let i = 0; i < validationResult.error.details.length; i++) {
      errors.push(validationResult.error.details[i].message);
    }

    return response.status(400).send(errors).end();
  }

  var lowerEmail = email.toLowerCase();
  user.checkEmailExists(lowerEmail)
    .then(function (existingEmail) {
      if (existingEmail) {
        return response.status(400).send(['Email already exists']).end();
      }
      return next();
    }).catch(function (error) { console.log(error); });
}

async function createUser(request, response) {
  const { first_name, last_name, email, password } = request.body
  var lowerEmail = email.toLowerCase();

  bcrypt.hash(password, 10, function (err, hash) {
    const id = uuidv4();

    server.query('INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)', [id, first_name, last_name, lowerEmail, hash], (error, result) => {
      if (error) {
        throw error
      }
      return response.status(201).send({ msg: 'success' });
    })
  });
}

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  getActivePollsByUserId: getActivePollsByUserId,
  validateCreateUser: validateCreateUser,
  validateIsAdmin, validateIsAdmin,
  createUser: createUser
}