/**
 * @typedef Book
 * @property {integer} id
 * @property {string} title.required - title
 * @property {string} original_language.required - original language
 * @property {integer} publishment_year.required - publishment year
 * @property {integer} pages.required - number of pages (GOST R 7.0.3-2006)
 * @property {string} added.required - date added (ISO8601)
 */
class Book
{
    constructor (id, title, original_language, publishment_year, pages, added)
    {
        this.id = id;
        this.title = title;
        this.original_language = original_language;
        this.publishment_year = publishment_year;
        this.pages = pages;
        this.added = added;
    }
};

module.exports = Book;