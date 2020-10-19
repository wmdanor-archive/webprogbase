const express = require('express');

const body_parser = require('body-parser')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const mainRouter = express();
const apiRouter = require('./apiRoute');

const expressSwaggerGenerator = require('express-swagger-generator');
const expressSwagger = expressSwaggerGenerator(mainRouter);
 
const config = {
    swaggerDefinition: {
        info: {
            description: 'description',
            title: 'title',
            version: '1.0.0',
        },
        host: 'localhost:55555',
        produces: [ "application/json", "image/png", "image/jpeg" ],
    },
    basedir: __dirname,
    files: ['./../routes/**/*.js', './../models/**/*.js'],
};
expressSwagger(config);

mainRouter.post('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err)
    {
        res.status(400).json({ error_message: err.message, error_object: err });
    }
    next();
});
mainRouter.put('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err)
    {
        res.status(400).json({ error_message: err.message, error_object: err });
    }
    next();
});
mainRouter.post('/api/media/', upload.single('image_file'), (res, req, next) => { next(); });

mainRouter.use('/api', apiRouter);

mainRouter.use((req, res) => {
    res.sendStatus(400);
});

mainRouter.use('/api', (err, req, res, next) => {
    console.log('internal error caught')
    console.log(err.message);

    res.status(500).json(err);
});

mainRouter.listen(55555, () => {
    console.log('Server started');
});

module.exports = mainRouter;