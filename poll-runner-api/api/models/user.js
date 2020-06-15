const server = require('../../connection.js');
const bcrypt = require('bcrypt');

async function checkEmailExists(email) {
    return new Promise(function (resolve, reject) {
        server.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }

            const rows = results.rows;

            if (rows.length > 0) {
                resolve(true);
            }

            resolve(false);
        })
    });
}

async function checkIfUserIsAdmin(id) {
    return new Promise(function (resolve, reject) {
        server.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }

            const rows = results.rows;

            if (rows[0].is_admin) {
                resolve(true);
            }

            resolve(false);
        })
    });
}

module.exports = {
    checkEmailExists: checkEmailExists,
    checkIfUserIsAdmin: checkIfUserIsAdmin
};