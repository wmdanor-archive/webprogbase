const UserRepository = require('./../repositories/userRepository');

const userRepository = new UserRepository('./data/users');

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
                if (isNaN(page)) { output.status(400).json({ error : 'page is not a number' }); return; }
                if (!Number.isInteger(page)) { output.status(400).json({ error : 'page is not an integer' }); return; }
                if (page < 1) { output.status(400).json({ error : 'invalid page value (page < 1)' }); return; }
            }

            const users = userRepository.getUsers();
            const size =  users.length;
            const offset = page_size * (page - 1);
            if (offset === 0 && size === 0)
            {
                output.status(200).json([]);
                return;
            }
            if (offset >= size) { output.status(400).json({ error : 'offset is bigger than users number (page size is 8)' }); return; }

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
            throw err;
        }
    },

    getUser(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) { output.status(400).json({ error : 'id is not a number' }); return; }
            if (!Number.isInteger(id)) { output.status(400).json({ error : 'id is not an integer' }); return; }
            if (id < 1) { output.status(400).json({ error : 'invalid id value (id < 1)' }); return; }
            
            const user = userRepository.getUserById(id);
            if (user === null) { output.status(404).json({ error: 'user not found' }); return; }
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
            throw err;
        }
    }
}