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
        try {
            const items = this.storage.readItems();
            let books = [];
            for (const item of items['items']) {
                books.push(new Book(
                    item['id'],
                    item['title'],
                    item['original_language'],
                    item['publishment_year'],
                    item['pages'],
                    item['added']
                ));
            }
            return books;
        } catch (err) {
            throw err;
        }
    }
 
    getBookById(book_id)
    {
        try {
            const items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === book_id) {
                    return new Book(
                        item['id'],
                        item['title'],
                        item['original_language'],
                        item['publishment_year'],
                        item['pages'],
                        item['added']
                    );
                }
            }
        } catch (err) {
            throw err;
        }
    }
 
    addBook(book_model)
    {
        try {
            let items = this.storage.readItems();
            book_model.id = this.storage.nextId;
            this.storage.incrementNextId();
            items['items'].push({
                id: book_model.id,
                title: book_model.title,
                original_language: book_model.original_language,
                publishment_year: book_model.publishment_year,
                pages: book_model.pages,
                added: book_model.added
            });
            this.storage.writeItems(items);
        } catch (err) {
            throw err;
        }
    }
 
    updateBook(book_model)
    {
        try {
            let items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === book_model.id) {
                    item['title'] = book_model.title;
                    item['original_language'] = book_model.original_language;
                    item['publishment_year'] = book_model.publishment_year;
                    item['pages'] = book_model.pages;
                    item['added'] = book_model.added;
                    this.storage.writeItems(items);
                    return true;
                }
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
 
    deleteBook(book_id)
    {
        try {
            let items = this.storage.readItems();
            for (const pair of items['items'].entries()) {
                if (pair[1]['id'] === book_id) {
                    items['items'].splice(pair[0], 1);
                    this.storage.writeItems(items);
                    return true;
                }
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
};
 
module.exports = BookRepository;
