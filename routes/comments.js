const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const { isLoggedIn, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');


//Creating a review
router.post('/', isLoggedIn, catchAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;