function jsonParser(json_text)
{
    try
    {
        let obj = JSON.parse(json_text);
        return obj;
    }
    catch (err)
    {
        throw(err);
    }
}

function jsonStringify(object)
{
    let json_text = JSON.stringify(object);
    return json_text;
}

function readFile(file_path)
{
    const fs = require('fs');
    const buffer = fs.readFileSync(file_path);
    const text = buffer.toString();
    return text;
}

function writeFile(file_path, json_text)
{
    const fs = require('fs');
    fs.writeFileSync(file_path, json_text);
}

class JsonStorage   // tut hueta, dodelatb !!!!!!!!!!!!!
{
    // filePath - path to JSON file
    // ./../data/users.json
    constructor(file_path) {
        this.__file_path = filePath;
    }

    get nextId()
    {
        try
        {
            const obj = jsonParser(readFile(this.__file_path+'users_ids.json'));
            return obj['next_id'];
        }
        catch (err)
        {
            throw(err);
        }
    }

    incrementNextId()
    {
        try
        {
            let obj = jsonParser(readFile(this.__file_path+'users_ids.json'));
            obj['next_id']++;
            this.writeItems(obj);
        }
        catch (err)
        {
            throw(err);
        }
    }

    readItems()
    {
        try
        {
            const obj = jsonParser(readFile(this.__file_path+'users.json'));
            return obj;
        }
        catch (err)
        {
            throw(err);
        }
    }

    writeItems(items)
    {
        try
        {
            writeFile(this.__file_path+'users.json', jsonStringify(items));
        }
        catch (err)
        {
            throw(err);
        }
    }
};

module.exports = JsonStorage;