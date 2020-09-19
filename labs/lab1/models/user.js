class User
{
    constructor(id, login, fullname, role, registered_at, ava_url, is_enabled)
    {
        this.id = id;
        this.login = login;
        this.fullname = fullname;
        this.role = role;
        this.registered_at = registered_at;
        this.ava_url = ava_url;
        this.is_enabled = is_enabled;
    }
 };
 
 module.exports = User;