const UserRepository = require('./../repositories/userRepository');
const User = require('./../models/user');

const userRepository = new UserRepository('./data/users');
const HttpError = require('./../httpError');
const { off } = require('../routes/mainRoute');

const page_size = 4;

module.exports = 
{
    getUsers(input, output)
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

            const users = userRepository.getUsers();
            const size =  users.length;
            const max_page = Math.ceil(size/page_size);
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                output.status(200).json([]);
                return;
            }
            if (offset >= size) throw new HttpError(400, 'offset is bigger than users number (page size is 8)');

            const users_page = users.slice(offset, offset + page_size);

            const arr = [];
            for (const user of users_page)
            {
                arr.push({
                    id: user.id,
                    login: user.login,
                    fullname: user.fullname,
                    registered_at: user.registered_at
                });
            }
            let prev_page = '<span>&lt;</span>';
            let next_page = '<span>&gt;</span>';
            if (page != 1) prev_page = '<a href=\"/users?page=' + (page-1) + '\">&lt;</a>'
            if (offset + page_size < size) next_page = '<a href=\"/users?page=' + (page+1) + '\">&gt;</a>'

            let pages = []

            if (page > 5)
            {
                pages.push('<a href=\"/users?page=1\">1</a>');
                if (page != 6) pages.push('<span>...</span>');
            }
            for (i = Math.max(page-4, 1); i < page; i++)
            {
                pages.push('<a href=\"/users?page=' + i + '\">' + i + '</a>');
            }
            pages.push('<span>' + page + '</span>');
            for (i = page+1; i <= Math.min(page+4, max_page); i++)
            {
                pages.push('<a href=\"/users?page=' + i + '\">' + i + '</a>');
            }
            if (page < max_page - 4)
            {
                if (page != max_page - 5) pages.push('<span>...</span>');
                pages.push('<a href=\"/users?page=' + max_page + '\">' + max_page + '</a>');
            }

            params = {head_title: 'Users', users_page: arr, users_current: 'current', next_page: next_page, prev_page: prev_page, pages: pages}
            output.status(200).render('users', params);
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    getUser(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer');
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            
            const user = userRepository.getUserById(id);
            if (user === null) throw new HttpError(404, 'user not found');
            else
            {
                const obj = {
                    id: user.id,
                    login: user.login,
                    fullname: user.fullname,
                    role: user.role,
                    registered_at: user.registered_at,
                    ava_url: user.ava_url,
                    is_enabled: user.is_enabled,
                    biography: user.biography
                };
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