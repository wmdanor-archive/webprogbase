const mstBookController = require('./../controllers/mstBookController')

const mstBookRouter = require('express').Router();

const HttpError = require('./../httpError');

mstBookRouter
    .get('/', mstBookController.getBooks)
    .get('/:id', mstBookController.getBook)
    .post('/', mstBookController.addBook)
    .delete('/:id',mstBookController.deleteBook);

mstBookRouter.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

module.exports = mstBookRouter;