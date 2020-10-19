const bookController = require('./../controllers/bookController')

const bookRouter = require('express').Router();

bookRouter
    /**
     * @route GET /api/books/{id}
     * @group Books - book operations
     * @param {integer} id.path.required - id of the Book
     * @returns {Book.model} 200 - Book object
     * @returns {Error} 400 - Bad request
     * @returns {Error} 404 - Book not found
    */
    .get('/', bookController.getBooks)
    /** 
     * @route GET /api/books
     * @group Books - book operations
     * @param {integer} page.query - page of the books list (page size is 8, default = 1)
     * @returns {Array.<Book>} 200 - Books page
     * @returns {Error} 400 - Bad request
    */
    .get('/:id', bookController.getBook)
    /**
     * @route POST /api/books
     * @group Books - book operations
     * @param {Book.model} book_model.body.required - book model to add
     * @returns {Book.model} 201 - Book created
     * @returns {Error} 400 - Bad request
    */
    .post('/', bookController.addBook)
    /**
     * @route PUT /api/books
     * @group Books - book operations
     * @param {Book.model} book_model.body.required - book model to update
     * @returns {Book.model} 200 - Book updated
     * @returns {Error} 400 - Bad request
     * @returns {Error} 404 - Book not found
    */
    .put('/', bookController.updateBook)
    /**
     * @route DELETE /api/books/{id}
     * @group Books - book operations
     * @param {integer} id.path.required - id of the Book
     * @returns {Book.model} 200 - Book object
     * @returns {Error} 400 - Bad request
     * @returns {Error} 404 - Book not found
     */
    .delete('/:id',bookController.deleteBook);

bookRouter.use((req, res) => {
    res.sendStatus(400);
});

module.exports = bookRouter;