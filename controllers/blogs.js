const Blog = require('../models/blog'); //Blog model



//BLOG ROUTES
//View all blogs
// get - '/blogs'
module.exports.index =  async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', {blogs})
}

// get - '/blogs/new', 
module.exports.newBlog = (req, res) => {
    const isAdmin = req.user && req.user.isAdmin;
    console.log(req.params);
    res.render('blogs/new', {isAdmin})
}

//post - '/blogs'
module.exports.createNewBlog = async(req ,res, next) =>{
    const blog = new Blog(req.body);
    blog.author = req.user._id
    console.log(blog.author);
    await blog.save();
    res.redirect('/blogs');
}

// get - '/blogs/:id'
module.exports.showBlog = async (req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    res.render('blogs/show', {blog})
}

//get - '/blogs/:id/edit' 
module.exports.editBlog = async (req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    res.render('blogs/edit', {blog})
}

//put - '/blogs/:id'
module.exports.updateBlog = async(req, res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/blogs/${blog._id}`)
}

//delete - '/blogs/:id'
module.exports.deleteBlog = async (req, res) => {
    const {id} = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.redirect('/blogs')
}