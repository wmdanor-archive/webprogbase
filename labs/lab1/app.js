const readlineSync = require('readline-sync');
const moment = require('moment');

const UserRepository = require('./repositories/userRepository');
const BookRepository = require('./repositories/bookRepository');
const User = require('./models/user');
const Book = require('./models/book');

let users = new UserRepository('./data/users');
let books = new BookRepository('./data/books');

console.log('app started')      // add&fix  try catches

while(1) {
    const command = readlineSync.question('Enter command: ');
    const parsed = command.split('/');
    const len = parsed.length;
    if (len === 1) {
        if (parsed[0] === 'exit') break;
        else console.log('Invalid command (=1)');
    } else if (len > 3) {
        console.log('Invalid command(>3)');
    } else {
        try {
            switch (parsed[0]) {
                case 'get':     // get
                    if (len === 3) {        // /get/{e}/{id}
                        const index = Number(parsed[2]);
                        if (isNaN(index)) {
                            console.log('Invalid id');
                            break;
                        }
                        switch (parsed[1]) {
                            case 'users':
                                const usr = users.getUserById(index);
                                if (usr === null) {
                                    console.log('User does not exist');
                                    break;
                                } else console.log(usr);
                                break;
                            case 'books':
                                const bk = books.getBookById(index);
                                if (bk === null) {
                                    console.log('Book does not exist');
                                    break;
                                } else console.log(bk);
                                break;
                            default:
                                console.log('Invalid entity');
                                break;
                        }
                    } else {            // /get/{e}
                        switch (parsed[1]) {
                            case 'users':
                                const usrs = users.getUsers();
                                console.log(usrs);
                                break;
                            case 'books':
                                const bks = books.getBooks();
                                console.log(bks);
                                break;
                            default:
                                console.log('Invalid entity');
                                break;
                        }
                    }
                    break;
                case 'delete':      // delete
                    if (len === 2) console.log('Invalid command');
                    else {
                        const index = Number(parsed[2]);
                        if (isNaN(index)) {
                            console.log('Invalid id');
                            break;
                        }
                        switch (parsed[1]) {
                        case 'users':
                            if (users.deleteUser(index)) console.log('User deleted');
                            else console.log('User does not exist');
                            break;
                        case 'books':
                            if (books.deleteBook(index)) console.log('Book deleted');
                            else console.log('Book does not exist');
                            break;
                        default:
                            console.log('Invalid entity');
                            break;
                    }
                }
                    break;
                case 'update':      // update
                    if (len === 2) console.log('Invalid command');
                    else {
                        const index = Number(parsed[2]);
                        if (isNaN(index)) {
                            console.log('Invalid id');
                            break;
                        }
                        switch (parsed[1]) {
                        case 'users':
                            let usr = users.getUserById(index);
                            if (usr === null) {
                                console.log('User does not exist');
                                break;
                            }
                            else {
                                console.log(usr);
                                const id = usr.id;
                                usr = userInput();
                                if (usr === null) break;
                                usr.id = id;
                                if (users.updateUser(usr)) console.log('Updating succesful');
                                else console.log('Updating error');
                            }
                            break;
                        case 'books':
                            let bk = books.getBookById(index);
                            if (bk === null) {
                                console.log('User does not exist');
                                break;
                            }
                            else {
                                console.log(bk);
                                const id = bk.id
                                bk = bookInput();
                                if (bk === null) break;
                                bk.id = id;
                                if (books.updateBook(bk)) console.log('Updating succesful');
                                else console.log('Updating error');
                            }
                            break;
                        default:
                            console.log('Invalid entity');
                            break;
                        }
                    }
                    break;
                case 'post':        // post
                    if (len === 3) console.log('Invalid command');
                    else switch (parsed[1]) {
                        case 'users':
                            const usr = userInput();
                            if (usr === null) break;
                            users.addUser(usr);
                            break;
                        case 'books':
                            const bk = bookInput();
                            if (bk === null) break;
                            books.addBook(bk);
                            break;
                        default:
                            console.log('Invalid entity');
                            break;
                    }
                    break;
                default:
                    console.log('Invalid command');
                    break;
            }
        } catch (err) {console.log('Data corrupted (parse error)')}
    }
}

function userInput()
{
    const login = readlineSync.question('Enter login: ');
    const fullname = readlineSync.question('Enter fullname: ');
    const role_str = readlineSync.question('Enter role: ');
    const role = Number(role_str);
    if (isNaN(role)) {
        console.log('Not a number');
        return null;
    }
    else if (role != 0 && role != 1) {
        console.log('Invalid role');
        return null;
    }
    const registered_at = readlineSync.question('Enter registration date (ISO 8601): ');
    if (!moment(registered_at, moment.ISO_8601, true).isValid()) {
        console.log('Invalid date');
        return null;
    }
    const ava_url = readlineSync.question('Enter ava url: ');
    const is_enabled_str = readlineSync.question('Is enabled? ');
    const is_enabled = stringToBool(is_enabled_str);
    if (is_enabled === null) {
        console.log('Invalid value');
        return null;
    }
    return new User(-1, login, fullname, role, registered_at, ava_url, is_enabled);
}

function bookInput()
{
    const title = readlineSync.question('Enter title: ');
    const original_language = readlineSync.question('Enter original language: ');
    const publishment_year_str =  readlineSync.question('Enter publishment year: ');
    const publishment_year = Number(publishment_year_str);
    if (isNaN(publishment_year)) {
        console.log('Not a number');
        return null;
    }
    const pages_str = readlineSync.question('Enter number of pages (GOST R 7.0.3-2006): ');
    const pages = Number(pages_str);
    if (isNaN(pages)) {
        console.log('Not a number');
        return null;
    }
    const added = readlineSync.question('Enter date added (ISO 8601): ');
    if (!moment(added, moment.ISO_8601, true).isValid()) {
        console.log('Invalid date');
        return null;
    }
    return new Book(-1, title, original_language, publishment_year, pages, added);
}

function stringToBool(str)
{
    switch (str)
    {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return null;
    }
}