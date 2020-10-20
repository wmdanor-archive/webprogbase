/**
 * @typedef ImageInfo
 * @property {integer} id
 * @property {string} file_name - file name
 */
class ImageInfo
{
    constructor (id, file_name, file_path = null)
    {
        this.id = file_name;
        this.file_name = file_name;
        this.file_path = file_path;
    }
}

module.exports = ImageInfo;