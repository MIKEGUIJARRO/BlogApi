const { Router } = require('express');
const { getComments, getComment, createComment, updateComment, deleteComment } = require('./controller');
const router = Router({ mergeParams: true });

router.route('/').get(getComments).post(createComment);

router.route('/:idComment').get(getComment)
    .put(updateComment).delete(deleteComment);

module.exports = router;