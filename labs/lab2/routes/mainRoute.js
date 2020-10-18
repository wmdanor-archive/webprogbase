const express = require('express');
const busboyBodyParser = require('busboy-body-parser');

const options = {
    limit: '16mb',
    multi: false,
};

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

mainRouter.use(busboyBodyParser(options));

mainRouter.use('/api', apiRouter);

mainRouter.use((req, res) => {
    res.sendStatus(400);
});

mainRouter.use((err, req, res) => {
    //
});

mainRouter.listen(55555, () => {
    console.log('Server started');
});

module.exports = mainRouter;