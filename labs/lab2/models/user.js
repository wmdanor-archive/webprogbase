/**
 * @typedef User
 * @property {integer} id
 * @property {string} login.required - unique username
 * @property {string} fullname.required - full name
 * @property {integer} role.required - 1 is admin, 0 is normal user
 * @property {date} registered_at.required - registration date (ISO8601)
 * @property {string} ava_url.required - ava url
 * @property {boolean} is_enabled.required - is user enabled
 */


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