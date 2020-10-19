const MediaRepository = require('./../repositories/mediaRepository');
const ImageInfo = require('./../models/image');

const mediaRepository = new MediaRepository('./data/images');

const fs = require('fs');

const options = {
    limit: '16mb',
    multi: false,
};

module.exports = 
{
    addImage(input, output)
    {
        try {
            const img = mediaRepository.addImage(new ImageInfo(0, input.files['image_file'].name));
            fs.writeFileSync('./data/images/'+img.id+'_'+img.file_name, input.files['image_file'].data);
            output.status(201);
            output.json({id: img.id, file_name: img.file_name});
        }
        catch (err)
        {
            throw err;
        }
    },

    getImage(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) { output.sendStatus(400); return; }
            if (!Number.isInteger(id)) { output.sendStatus(400); return; }
            if (id < 1) { output.sendStatus(400); return; }
            
            const image = mediaRepository.getImageById(id);
            if (image === null) { output.sendStatus(404); return; }
            else
            {
                output.status(200);
                output.download('./data/images/'+id+'_'+image.file_name);
            }
        }
        catch (err)
        {
            throw err;
        }
    }
}