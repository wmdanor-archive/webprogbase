/**
 * @typedef ImageInfo
 * @property {integer} id
 * @property {string} file_name - file name
 * @property {string} b64_str - base64 string of image (DO NOT USE)
 */

class ImageInfo
{
    constructor (id, file_name, b64_str = null)
    {
        this.id = file_name;
        this.file_name = file_name;
        this.b64_str = b64_str;
    }
}

module.exports = ImageInfo;