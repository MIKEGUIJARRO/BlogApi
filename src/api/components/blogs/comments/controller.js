const asyncHandler = require("../../../../util/async");
const comment = require('../../../model/Comment');

module.exports.getComments = asyncHandler(async (req, res, next) => {
    const { idBlog } = req.params;
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startRow = (page - 1) * limit + 1;
    const endRow = page * limit;
    const condition = {
        blog_id: idBlog
    }
    const total = await comment.countRowsWhere(condition);
    console.log(total)
    if (startRow > total) {
        throw new ErrorResponse('Bad Request. Page out of bounds.', 400);
    }
    const conditions = {
        blog_id: idBlog
    }
    const { rows, fields } = await comment.findWhere(startRow, limit, conditions);

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
        data: 'getComments endpoint',
        count: rows.length,
        pagination,
        data: rows
    });
});

module.exports.getComment = asyncHandler(async (req, res, next) => {
    const { idBlog, idComment } = req.params;
    const conditions = {
        blog_id: idBlog
    }
    const { rows, fields } = await comment.findByIdWhere(idComment, conditions);

    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.createComment = asyncHandler(async (req, res, next) => {
    const { idBlog } = req.params;

    const body = {
        ...req.body,
        blog_id: idBlog
    };

    const { rows, fields } = await comment.create(body);

    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.updateComment = asyncHandler(async (req, res, next) => {
    const { idBlog, idComment } = req.params;
    const conditions = {
        blog_id: idBlog
    }
    const { rows, fields } = await comment.findByIdAndUpdateWhere(idComment, req.body, conditions);
    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});

module.exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { idBlog, idComment } = req.params;
    const conditions = {
        blog_id: idBlog
    }
    const { rows, fields } = await comment.findByIdAndDeleteWhere(idComment, conditions);
    res.status(200).json({
        success: true,
        data: {
            ...rows[0]
        }
    });
});