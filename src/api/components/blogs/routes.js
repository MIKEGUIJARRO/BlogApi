const { Router } = require('express');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('./controller');
const router = Router();

router.route('/').get(getBlogs);

router.route('/:id').get(getBlog).post(createBlog)
    .put(updateBlog).delete(deleteBlog);

module.exports = router;