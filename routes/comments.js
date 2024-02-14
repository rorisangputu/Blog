const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const { isLoggedIn, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comment');


//Creating a review
router.post('/',  catchAsync(comments.createComment));

router.delete('/:commentId', isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;