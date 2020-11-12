const mstUserController = require('./../controllers/mstUserController');

const mstUserRoute = require('express').Router();

const HttpError = require('./../httpError');

mstUserRoute
    .get('/', mstUserController.getUsers)
    .get('/:id', mstUserController.getUser);

mstUserRoute.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

module.exports = mstUserRoute;