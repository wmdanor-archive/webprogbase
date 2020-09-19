const Book = require('../models/book');
const JsonStorage = require('../jsonStorage');
 
class BookRepository
{
    constructor(file_path)
    {
        this.storage = new JsonStorage(file_path);
    }
 
    getBooks()
    { 
        throw new Error("Not implemented"); 
    }
 
    getBookById(book_id)
    {
        throw new Error("Not implemented"); 
    }
 
    addBook(book_model)
    {
        throw new Error("Not implemented"); 
    }
 
    updateBook(book_model)
    {
        throw new Error("Not implemented"); 
    }
 
    deleteBook(book_id)
    {
        throw new Error("Not implemented"); 
    }
};
 
module.exports = BookRepository;
