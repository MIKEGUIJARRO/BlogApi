const asyncHandler = require('../../../util/async')

module.exports.getBlogs = asyncHandler((req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            route: 'getBlogs'
        }
    });
});

module.exports.getBlog = asyncHandler((req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'getBlog',
            id: id,
        }
    });
});

module.exports.createBlog = asyncHandler((req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'createBlog',
            id: id,
        }
    });
});

module.exports.updateBlog = asyncHandler((req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'updateBlog',
            id: id,
        }
    });
});

module.exports.deleteBlog = asyncHandler((req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'deleteBlog',
            id: id,
        }
    });
});