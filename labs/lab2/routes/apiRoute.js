const userRouter = require('./userRoute');
const bookRouter = require('./bookRoute');
const mediaRouter = require('./mediaRoute');

const apiRouter = require('express').Router();

const HttpError = require('./../httpError');

apiRouter
    .use('/users', userRouter)
    .use('/books', bookRouter)
    .use('/media', mediaRouter);

apiRouter.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

module.exports = apiRouter;