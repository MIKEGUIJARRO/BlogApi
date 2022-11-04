const { Router } = require('express');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('./controller');
const router = Router();

router.route('/').get(getBlogs).post(createBlog);

router.route('/:id').get(getBlog)
    .put(updateBlog).delete(deleteBlog);

module.exports = router;