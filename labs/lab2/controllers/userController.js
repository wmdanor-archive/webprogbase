const UserRepository = require('./../repositories/userRepository');

const userRepository = new UserRepository('./data/users');

const busboy = require('busboy-body-parser');

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
                if (isNaN(page)) { output.sendStatus(400); return; }
                if (!Number.isInteger(page)) { output.sendStatus(400); return; }
                if (page < 1) { output.sendStatus(400); return; }
            }

            const users = userRepository.getUsers();
            const size =  users.length;
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                output.status(200);
                output.json([]);
                return;
            }
            if (offset >= size) { output.sendStatus(400); return; }

            const users_page = users.slice(offset, offset + page_size);

            let arr = [];
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
            output.status(200);
            output.json(arr);
        }
        catch (err)
        {
            throw err;
        }
    },

    getUser(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) { output.sendStatus(400); return; }
            if (!Number.isInteger(id)) { output.sendStatus(400); return; }
            if (id < 1) { output.sendStatus(400); return; }
            
            const user = userRepository.getUserById(id);
            if (user === null) { output.sendStatus(404); return; }
            else
            {
                output.status(200);
                // output.type('json');
                const obj = {
                    id: user.id,
                    login: user.login,
                    fullname: user.fullname,
                    role: user.role,
                    registered_at: user.registered_at,
                    ava_url: user.ava_url,
                    is_enabled: user.is_enabled
                };
                output.json(obj);
            }
        }
        catch (err)
        {
            throw err;
        }
    }
}