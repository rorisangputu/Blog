const Comment = require('../models/comments');
const Blog = require('../models/blog');

module.exports.createComment = async (req, res) =>{
    const blog = await Blog.findById(req.params.id); 
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', 'Successfully created a review');
    res.redirect(`/blogs/${blog._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId}})
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Deleted review');
    res.redirect(`/blogs/${id}`)
}