const User = require('../models/user');
const JsonStorage = require('../jsonStorage');
 
class UserRepository
{
    constructor(file_path)
    {
        this.storage = new JsonStorage(file_path);
    }
 
    getUsers()
    { 
        try {
            const items = this.storage.readItems();
            let users = [];
            for (const item of items['items']) {
                users.push(new User(
                    item['id'],
                    item['login'],
                    item['fullname'],
                    item['role'],
                    item['registered_at'],
                    item['ava_url'],
                    item['is_enabled']
                ));
            }
            return users;
        } catch (err) {
            throw err;
        }
    }
 
    getUserById(user_id)
    {
        try {
            const items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === user_id) {
                    return new User(
                        user_id,
                        item['login'],
                        item['fullname'],
                        item['role'],
                        item['registered_at'],
                        item['ava_url'],
                        item['is_enabled']
                    );
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }
 
    addUser(user_model)
    {
        try {
            let items = this.storage.readItems();
            user_model.id = this.storage.nextId;
            this.storage.incrementNextId();
            items['items'].push({
                id: user_model.id,
                login: user_model.login,
                fullname: user_model.fullname,
                role: user_model.role,
                registered_at: user_model.registered_at,
                ava_url: user_model.ava_url,
                is_enabled: user_model.is_enabled
            });
            this.storage.writeItems(items);
        } catch (err) {
            throw err;
        }
    }
 
    updateUser(user_model)
    {
        try {
            let items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === user_model.id) {
                    item['login'] = user_model.login;
                    item['fullname'] = user_model.fullname;
                    item['role'] = user_model.role;
                    item['registered_at'] = user_model.registered_at;
                    item['ava_url'] = user_model.ava_url;
                    item['is_enabled'] = user_model.is_enabled;
                    this.storage.writeItems(items);
                    return true;
                }
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
 
    deleteUser(user_id)
    {
        try {
            let items = this.storage.readItems();
            for (const pair of items['items'].entries()) {
                if (pair[1]['id'] === user_id) {
                    items['items'].splice(pair[0], 1);
                    this.storage.writeItems(items);
                    return true;
                }
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
};
 
module.exports = UserRepository;
