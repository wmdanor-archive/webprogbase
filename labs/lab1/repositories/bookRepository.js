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
    }
 
    getBookById(book_id)
    {
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
    }
 
    addBook(book_model)
    {
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
    }
 
    updateBook(book_model)
    {
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
    }
 
    deleteBook(book_id)
    {
        let items = this.storage.readItems();
        for (const pair of items['items'].entries()) {
            if (pair['item']['id'] === book_id) {
                items.splice(pair['index'], 1);
                this.storage.writeItems(items);
                return true;
            }
        }
        return false;
    }
};
 
module.exports = BookRepository;
