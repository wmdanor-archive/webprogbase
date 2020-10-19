const BookRepository = require('./../repositories/bookRepository');

const bookRepository = new BookRepository('./data/books');

const Book = require('../models/book');

const moment = require('moment');

const page_size = 8;

function bookToObject(book)
{
    return {
        id: book.id,
        title: book.title,
        original_language: book.original_language,
        publishment_year: book.publishment_year,
        pages: book.pages,
        added: book.added
    };
}

function bookParser(obj, id_check = false)
{
    try
    {
        // const obj = JSON.parse(json_obj);
        let id;
        if (id_check)
        {
            id = obj['id'];
            if (!Number.isInteger(id)) { throw new Error('id is not an integer'); }
            else if (id < 1) { throw new Error('invalid id value (id < 1)'); }
        }
        else { id = 0; }

        if (typeof obj['title'] != 'string' || typeof obj['original_language'] != 'string' ||
            typeof obj['added'] != 'string' || !Number.isInteger(obj['publishment_year']) ||
            !Number.isInteger(obj['pages'])) { throw new Error('invalid field types'); }
        else if (!moment(obj['added'], moment.ISO_8601, true).isValid()) { throw new Error('invalid date format'); }
        else 
        {
            return new Book(
                id,
                obj['title'],
                obj['original_language'],
                obj['publishment_year'],
                obj['pages'],
                obj['added']
            );
        }
    }
    catch (err)
    {
        throw err;
    }
}

module.exports = 
{
    getBooks(input, output)
    {
        try {
            const page_str = input.query.page;
            let page;
            if (page_str === undefined) page = 1;
            else 
            {
                page = Number(page_str);
                if (isNaN(page)) { output.status(400).json({ error : 'page is not a number' }); return; }
                if (!Number.isInteger(page)) { output.status(400).json({ error : 'page is not an integer' }); return; }
                if (page < 1) { output.status(400).json({ error : 'invalid page value (page < 1)' }); return; }
            }

            const books = bookRepository.getBooks();
            const size =  books.length;
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                output.status(200).json([]);
                return;
            }
            if (offset >= size) { output.status(400).json({ error : 'offset is bigger than users number (page size is 8)' }); return; }

            const books_page = books.slice(offset, offset + page_size);

            const arr = [];
            for (const book of books_page)
            {
                arr.push(bookToObject(book));
            }
            output.status(200).json(arr);
        }
        catch (err)
        {
            throw err;
        }
    },

    getBook(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) { output.status(400).json({ error : 'id is not a number' }); return; }
            if (!Number.isInteger(id)) { output.status(400).json({ error : 'id is not an integer' }); return; }
            if (id < 1) { output.status(400).json({ error : 'invalid id value (id < 1)' }); return; }
            
            const book = bookRepository.getBookById(id);
            if (book === null) { output.status(404).json({ error: 'book not found' }); return; }
            else
            {
                const obj = bookToObject(book);
                output.status(200).json(obj);
            }
        }
        catch (err)
        {
            throw err;
        }
    },

    addBook(input, output)
    {
        try {
            try
            {
                const book_model = bookParser(input.body);
                const book = bookRepository.addBook(book_model);
                const obj = bookToObject(book);
                output.status(201).json(obj);
            }
            catch (err) { output.status(400).json({ error : err.message }); return; }
        }
        catch (err)
        {
            throw err;
        }
    },

    updateBook(input, output)
    {
        try {
            try
            {
                const book_model = bookParser(input.body, true);
                const book = bookRepository.updateBook(book_model);
                if (book === null) { output.status(404).json({ error: 'book not found' }); return; }
                else
                {
                    const obj = bookToObject(book);
                    output.status(200).json(obj);
                }
            }
            catch (err) { output.status(400).json({ error : err.message }); return; }
        }
        catch (err)
        {
            throw err;
        }
    },

    deleteBook(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) { output.status(400).json({ error : 'id is not a number' }); return; }
            if (!Number.isInteger(id)) { output.status(400).json({ error : 'id is not an integer' }); return; }
            if (id < 1) { output.status(400).json({ error : 'invalid id value (id < 1)' }); return; }

            const book = BookRepository.deleteBook(id);
            if (book === null) { output.status(404).json({ error: 'book not found' }); return; }
            else
            {
                const obj = bookToObject(book);
                output.status(200).json(obj);
            }
        }
        catch (err)
        {
            throw err;
        }
    }
}