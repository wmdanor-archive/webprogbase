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
                const paginator_pages = []
                paginator_pages.push({element_text: '<'})
                paginator_pages.push({element_text: '>'})

                output.status(200).render('books', {head_title: 'Users', books_page: null, users_current: 'current',
                    paginator_pages: paginator_pages});
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

            const paginator_pages = []

            if (page === 1) paginator_pages.push({element_text: '<'})
            else paginator_pages.push({element_page: page-1, element_text: '<'})

            if (page > 5)
            {
                paginator_pages.push({element_page: 1, element_text: 1})
                if (page != 6) paginator_pages.push({element_text: '...'})
            }
            for (i = Math.max(page-4, 1); i < page; i++)
            {
                paginator_pages.push({element_page: i, element_text: i})
            }
            paginator_pages.push({element_text: page})
            for (i = page+1; i <= Math.min(page+4, max_page); i++)
            {
                paginator_pages.push({element_page: i, element_text: i})
            }
            if (page < max_page - 4)
            {
                if (page != max_page - 5) paginator_pages.push({element_text: '...'})
                paginator_pages.push({element_page: max_page, element_text: max_page})
            }

            if (offset + page_size < size) paginator_pages.push({element_page: page+1, element_text: '>'})
            else paginator_pages.push({element_text: '>'})

            params = {head_title: 'Users', users_page: arr, users_current: 'current', paginator_pages: paginator_pages}
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
                let role = 'user';
                if (user.role === 1) role = 'admin';
                let bio = 'No biography'
                if (user.biography != null) bio = user.biography
                const obj = {
                    id: user.id,
                    login: user.login,
                    fullname: user.fullname,
                    role: role,
                    registered_at: user.registered_at,
                    ava_url: user.ava_url,
                    is_enabled: user.is_enabled,
                    biography: bio
                };
                output.status(200).render('user', {head_title: 'User', users_current: 'current', user: obj});
            }
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}