const BookRepository = require('./../repositories/bookRepository');
const MediaRepository = require('./../repositories/mediaRepository');
const Book = require('./../models/book');
const MediaInfo = require('./../models/media');

const bookRepository = new BookRepository('./data/books');
const mediaRepository = new MediaRepository('./data/media');
const HttpError = require('./../httpError');

const moment = require('moment');

const page_size = 1;

function bookToObject(book)
{
    return {
        id: book.id,
        title: book.title,
        original_language: book.original_language,
        publishment_year: book.publishment_year,
        pages: book.pages,
        added: book.added,
        file_url: book.file_url
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
        
        if (!moment(obj['added'], moment.ISO_8601, true).isValid()) throw new HttpError(400, 'invalid date format');
        else 
        {
            year = parseInt(obj.publishment_year)
            pages = parseInt(obj.pages)
            if (isNaN(year) || isNaN(pages)) throw new HttpError(400, 'Invalid data format');
            return new Book(
                id,
                obj['title'],
                obj['original_language'],
                year,
                pages,
                obj['added'],
                obj['file_url']
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
            const title_search = input.query.title;
            let page;
            if (page_str === undefined) page = 1;
            else 
            {
                page = Number(page_str);
                if (isNaN(page)) throw new HttpError(400, 'page is not a number');
                if (!Number.isInteger(page)) throw new HttpError(400, 'page is not an integer');
                if (page < 1) throw new HttpError(400, 'invalid page value (page < 1)');
            }

            let books = bookRepository.getBooks();

            if (!(title_search === undefined))
            {
                books = books.filter(item => item.title.includes(title_search));
            }
            
            const size =  books.length;
            const max_page = Math.ceil(size/page_size);
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                const paginator_pages = []
                paginator_pages.push({element_text: '<'})
                paginator_pages.push({element_text: '>'})

                output.status(200).render('books', {head_title: 'Books', books_page: null, books_current: 'current',
                    paginator_pages: paginator_pages, title_query: title_search});
                return;
            }
            if (offset >= size) throw new HttpError(400, 'offset is bigger than books number (page size is 8)');

            const books_page = books.slice(offset, offset + page_size);

            const arr = [];
            for (const book of books_page)
            {
                arr.push(bookToObject(book));
            }

            const paginator_pages = []

            let title_query = ''; 
            if (!(title_search === undefined)) title_query = '&title=' + title_search;

            if (page === 1) paginator_pages.push({element_text: '<'})
            else paginator_pages.push({element_page: page-1, element_text: '<', title_query: title_search})

            let pages = []

            if (page > 5)
            {
                paginator_pages.push({element_page: 1, element_text: 1, title_query: title_search})
                if (page != 6) paginator_pages.push({element_text: '...'})
            }
            for (i = Math.max(page-4, 1); i < page; i++)
            {
                paginator_pages.push({element_page: i, element_text: i, title_query: title_search})
            }
            paginator_pages.push({element_text: page})
            for (i = page+1; i <= Math.min(page+4, max_page); i++)
            {
                paginator_pages.push({element_page: i, element_text: i, title_query: title_search})
            }
            if (page < max_page - 4)
            {
                if (page != max_page - 5) paginator_pages.push({element_text: '...'})
                paginator_pages.push({element_page: max_page, element_text: max_page, title_query: title_search})
            }

            if (offset + page_size < size) paginator_pages.push({element_page: page+1, element_text: '>', title_query: title_search})
            else paginator_pages.push({element_text: '>'})

            params = {head_title: 'Books', books_page: arr, books_current: 'current', paginator_pages: paginator_pages, title_query: title_search}
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
                output.status(200).render('book', {head_title: 'Books', books_current: 'current', book: obj});
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
            const media = mediaRepository.addMedia(new MediaInfo(0, input.file.originalname, input.file.path));
            let body = input.body;
            body.file_url = 'http://localhost:55555/api/media/' + media.id;
            const book_model = bookParser(body);
            const book = bookRepository.addBook(book_model);
            const obj = bookToObject(book);
            output.status(303).redirect('http://localhost:55555/books/' + obj.id)

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
                output.status(303).redirect('http://localhost:55555/books')
            }
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}