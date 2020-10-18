const ImageInfo = require('./../models/image')
const JsonStorage = require('../jsonStorage');

const fs = require('fs');

class MediaRepository
{
    constructor(file_path)
    {
        this.storage = new JsonStorage(file_path);
    }

    getImageById(image_id)
    {
        try {
            const items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === image_id) {
                    const file_name = item['file_name'];
                    // const b64_str = fs.readFileSync(file_path+'/images/'+image_id+'_'+file_name, {encoding: 'base64'});
                    return new ImageInfo(
                        image_id,
                        file_name
                    )
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }

    addImage(image_model)
    {
        try {
            let items = this.storage.readItems();
            image_model.id = this.storage.nextId;
            this.storage.incrementNextId();
            items['items'].push({
                id: image_model.id,
                file_name: image_model.file_name
            });
            this.storage.writeItems(items);
            // fs.writeFileSync(file_path+'/images/'+image_id+'_'+file_name, image_model.b64_str, {encoding: 'base64'});

            // image_model.b64_str = null;
            return image_model;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = MediaRepository;