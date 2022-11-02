const { Router } = require('express');
const blogsRouter = require('./components/blogs/routes');
const router = Router();


router.use('/blogs', blogsRouter);

module.exports = { router }