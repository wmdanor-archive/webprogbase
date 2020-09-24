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
    }
 
    getUserById(user_id)
    {
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
    }
 
    addUser(user_model)
    {
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
    }
 
    updateUser(user_model)
    {
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
    }
 
    deleteUser(user_id)
    {
        let items = this.storage.readItems();
        for (const pair of items['items'].entries()) {
            if (pair['item']['id'] === user_id) {
                items.splice(pair['index'], 1);
                this.storage.writeItems(items);
                return true;
            }
        }
        return false;
    }
};
 
module.exports = UserRepository;
