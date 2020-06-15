const server = require('../../connection.js');

const getPolls = (request, response) => {
    server.query('SELECT * FROM polls', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows);
    })
}

module.exports = {
    getPolls: getPolls,
}