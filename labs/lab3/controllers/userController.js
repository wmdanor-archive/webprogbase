const UserRepository = require('./../repositories/userRepository');
const User = require('./../models/user');

const userRepository = new UserRepository('./data/users');
const HttpError = require('./../httpError');

const page_size = 8;

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
                    role: user.role,
                    registered_at: user.registered_at,
                    ava_url: user.ava_url,
                    is_enabled: user.is_enabled
                });
            }
            output.status(200).json(arr);
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
                    is_enabled: user.is_enabled
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