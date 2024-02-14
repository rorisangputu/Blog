const Blog = require('./models/blog');
const Comment = require('./models/comments');



module.exports.isLoggedIn = (req, res, next )=> {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission');
        return res.redirect(`/blogs/${id}`);
    }
    next(); 
}
// module.exports.isAdmin = async(req, res, next) => {
    
//     const admin = await Admin.findById(req.user._id);
//     if(!admin){
//         req.flash('error', 'You dont have permission');
//         return res.redirect('/blogs');
//     }
//     next(); 
// }

module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if(!comment.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    next(); 
}