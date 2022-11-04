const asyncHandler = require('../../../util/async');
const ErrorResponse = require('../../../util/ErrorResponse');
const blog = require('../../model/Blog');

module.exports.getBlogs = asyncHandler(async (req, res, next) => {

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startRow = (page - 1) * limit + 1;
    const endRow = page * limit;
    const total = await blog.countRows();
    if (startRow > total) {
        throw new ErrorResponse('Bad Request. Page out of bounds.', 400);
    }

    const { rows, fields } = await blog.find(startRow, limit);

    // Pagination result
    const pagination = {};
    if (startRow > 1) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }
    if (endRow < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }

    res.status(200).json({
        success: true,
        count: rows.length,
        pagination,
        data: rows,
    });
});

module.exports.getBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { rows, fields } = await blog.findById(id);

    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.createBlog = asyncHandler(async (req, res, next) => {
    const { rows, fields } = await blog.create(req.body);

    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.updateBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const { rows, fields } = await blog.findByIdAndUpdate(id, req.body);
    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.deleteBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { rows, fields } = await blog.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});