const mstBookController = require('./../controllers/mstBookController')

const mstBookRouter = require('express').Router();

const HttpError = require('./../httpError');

mstBookRouter
    .get('/', mstBookController.getBooks)
    .get('/new', (req, res) => { res.status(200).render('new_book', {head_title: 'New book', books_current: 'current'}) })
    .get('/:id', mstBookController.getBook)
    .post('/', mstBookController.addBook)
    .delete('/:id',mstBookController.deleteBook);

mstBookRouter.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

module.exports = mstBookRouter;