module.exports.getBlogs = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            route: 'getBlogs'
        }
    });
}

module.exports.getBlog = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'getBlog',
            id: id,
        }
    });
}

module.exports.createBlog = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'createBlog',
            id: id,
        }
    });
}

module.exports.updateBlog = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'updateBlog',
            id: id,
        }
    });
}

module.exports.deleteBlog = (req, res, next)=> {
    const {id} = req.params;
    res.status(200).json({
        success: true,
        data: {
            route: 'deleteBlog',
            id: id,
        }
    });
}