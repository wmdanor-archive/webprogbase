const BookRepository = require('./../repositories/bookRepository');

const bookRepository = new BookRepository('./data/books');

const busboy = require('busboy-body-parser');
const Book = require('../models/book');

const page_size = 8;

module.exports = 
{
    getBooks(input, output)
    {
        const page_str = input.query.page;
        let page;
        if (page_str === undefined) page = 1;
        else 
        {
            page = Number(page_str);
            if (isNaN(page)) { output.sendStatus(400); return; }
            if (!Number.isInteger(page)) { output.sendStatus(400); return; }
            if (page < 1) { output.sendStatus(400); return; }
        }

        const books = bookRepository.getBooks();
        const size =  books.length;
        const offset = page_size * (page - 1);
        if (offset === 0 && size === 0)
        {
            output.status(200);
            output.json([]);
            return;
        }
        if (offset >= size) { output.sendStatus(400); return; }

        const books_page = books.slice(offset, offset + page_size);

        let arr = [];
        for (const book of books_page)
        {
            arr.push({
                id: book.id,
                title: book.title,
                original_language: book.original_language,
                publishment_year: book.publishment_year,
                pages: book.pages,
                added: book.added
            });
        }
        output.status(200);
        output.json(arr);
    },

    getBook(input, output)
    {
        const id_str = input.params.id;
        const id = Number(id_str);
        if (isNaN(id)) { output.sendStatus(400); return; }
        if (!Number.isInteger(id)) { output.sendStatus(400); return; }
        if (id < 1) { output.sendStatus(400); return; }
        
        const book = bookRepository.getBookById(id);
        if (book === null) { output.sendStatus(404); return; }
        else
        {
            output.status(200);
            // output.type('json');
            const obj = {
                id: book.id,
                title: book.title,
                original_language: book.original_language,
                publishment_year: book.publishment_year,
                pages: book.pages,
                added: book.added
            };
            output.json(obj);
        }
    },

    addBook(input, output)
    {
        const buf = input.files['file-key'].data;
        const obj = JSON.parse(obj);
        const book_model = new Book(
            0,
            obj['title'],
            obj['original_language'],
            obj['publishment_year'],
            obj['pages'],
            obj['added']
        )
        const book = bookRepository.addBook(book_model);
        if (book === null) { output.sendStatus(404); return; }
        else
        {
            output.status(201);
            const obj = {
                id: book.id,
                title: book.title,
                original_language: book.original_language,
                publishment_year: book.publishment_year,
                pages: book.pages,
                added: book.added
            };
            output.json(obj);
        }
    },

    updateBook(input, output)
    {
        const buf = input.files['file-key'].data;
        const obj = JSON.parse(obj);
        const book_model = new Book(
            obj['id'],
            obj['title'],
            obj['original_language'],
            obj['publishment_year'],
            obj['pages'],
            obj['added']
        )
        const book = bookRepository.updateBook(book_model);
        if (book === null) { output.sendStatus(404); return; }
        else
        {
            output.status(200);
            const obj = {
                id: book.id,
                title: book.title,
                original_language: book.original_language,
                publishment_year: book.publishment_year,
                pages: book.pages,
                added: book.added
            };
            output.json(obj);
        }
    },

    deleteBook(input, output)
    {
        const id_str = input.params.id;
        const id = Number(id_str);
        if (isNaN(id)) { output.sendStatus(400); return; }
        if (!Number.isInteger(id)) { output.sendStatus(400); return; }
        if (id < 1) { output.sendStatus(400); return; }

        const book = BookRepository.deleteBook(id);
        if (book === null) { output.sendStatus(404); return; }
        else
        {
            output.status(200);
            // output.type('json');
            const obj = {
                id: book.id,
                title: book.title,
                original_language: book.original_language,
                publishment_year: book.publishment_year,
                pages: book.pages,
                added: book.added
            };
            output.json(obj);
        }
    }
}