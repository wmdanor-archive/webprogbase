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
            const img = mediaRepository.addImage(new ImageInfo(0, input.file.originalname));
            fs.writeFileSync('./data/images/'+img.id+'_'+img.file_name, fs.readFileSync(input.file.path));
            output.status(201).json({id: img.id, file_name: img.file_name});
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
            if (isNaN(id)) { output.status(400).json({ error : 'id is not a number' }); return; }
            if (!Number.isInteger(id)) { output.status(400).json({ error : 'id is not an integer' }); return; }
            if (id < 1) { output.status(400).json({ error : 'invalid id value (id < 1)' }); return; }
            
            const image = mediaRepository.getImageById(id);
            if (image === null) { output.status(404).json({ error: 'image not found' }); return; }
            else
            {
                output.status(200).download('./data/images/'+id+'_'+image.file_name);
            }
        }
        catch (err)
        {
            throw err;
        }
    }
}