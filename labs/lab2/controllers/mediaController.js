const MediaRepository = require('./../repositories/mediaRepository');
const ImageInfo = require('./../models/image');

const mediaRepository = new MediaRepository('./data/images');
const HttpError = require('./../httpError');

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
            const img = mediaRepository.addImage(new ImageInfo(0, input.file.originalname));
            fs.writeFileSync('./data/images/'+img.id+'_'+img.file_name, fs.readFileSync(input.file.path));
            output.status(201).json({id: img.id, file_name: img.file_name});
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    getImage(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer');
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            
            const image = mediaRepository.getImageById(id);
            if (image === null) throw new HttpError(404, 'image not found');
            else
            {
                output.status(200).download('./data/images/'+id+'_'+image.file_name);
            }
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}