const User = require("./user");

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