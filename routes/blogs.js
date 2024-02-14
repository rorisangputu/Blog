const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const blogs = require('../controllers/blogs');

router.route('/')
    .get(catchAsync(blogs.index))
    .post(catchAsync(blogs.createNewBlog));

router.route('/new')
    .get( blogs.newBlog)

router.route('/:id')
    .get(catchAsync(blogs.showBlog))
    .put(catchAsync(blogs.updateBlog))
    .delete(catchAsync(blogs.deleteBlog))

router.route('/:id/edit')
    .get(catchAsync(blogs.editBlog))


module.exports = router;