const BookRepository = require('./../repositories/bookRepository');
const Book = require('./../models/book');

const bookRepository = new BookRepository('./data/books');
const HttpError = require('./../httpError');

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
        let id;
        if (id_check)
        {
            id = obj['id'];
            if (!Number.isInteger(id)) { throw new HttpError(400, 'id is not an integer'); }
            else if (id < 1) { throw new HttpError(400, 'invalid id value (id < 1)'); }
        }
        else { id = 0; }

        if (typeof obj['title'] != 'string' || typeof obj['original_language'] != 'string' ||
            typeof obj['added'] != 'string' || !Number.isInteger(obj['publishment_year']) ||
            !Number.isInteger(obj['pages'])) throw new HttpError(400, 'invalid field types');
        else if (!moment(obj['added'], moment.ISO_8601, true).isValid()) throw new HttpError(400, 'invalid date format');
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
        if (err instanceof HttpError) throw err;
        else throw new HttpError(400, err.message);
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
                if (isNaN(page)) throw new HttpError(400, 'page is not a number');
                if (!Number.isInteger(page)) throw new HttpError(400, 'page is not an integer');
                if (page < 1) throw new HttpError(400, 'invalid page value (page < 1)');
            }

            const books = bookRepository.getBooks();
            const size =  books.length;
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                output.status(200).json([]);
                return;
            }
            if (offset >= size) throw new HttpError(400, 'offset is bigger than books number (page size is 8)');

            const books_page = books.slice(offset, offset + page_size);

            const arr = [];
            for (const book of books_page)
            {
                arr.push(bookToObject(book));
            }
            let prev_page = '<span>&lt;</span>';
            let next_page = '<span>&gt;</span>';
            if (page != 1) prev_page = '<a href=\"/books?page=' + (page-1) + '\">&lt;</a>'
            if (offset + page_size < size) next_page = '<a href=\"/books?page=' + (page+1) + '\">&gt;</a>'
            params = {head_title: 'Books', books_page: arr, books_current: 'current', next_page: next_page, prev_page: prev_page, page: page}
            output.status(200).render('books', params);
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    getBook(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer');
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            
            const book = bookRepository.getBookById(id);
            if (book === null) throw new HttpError(404, 'book not found');
            else
            {
                const obj = bookToObject(book);
                output.status(200).json(obj);
            }
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    addBook(input, output)
    {
        try {
            const book_model = bookParser(input.body);
            const book = bookRepository.addBook(book_model);
            const obj = bookToObject(book);
            output.status(201).json(obj);
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    deleteBook(input, output)
    {
        try
        {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer' );
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            const book = bookRepository.deleteBook(id);
            if (book === null) throw new HttpError(404, 'book not found');
            else
            {
                const obj = bookToObject(book);
                output.status(200).json(obj);
            }
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}