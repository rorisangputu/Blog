const Blog = require('../models/blog'); //Blog model
const User = require('../models/user');



//BLOG ROUTES
//View all blogs
// get - '/blogs'
module.exports.index =  async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', {blogs})
}

// get - '/blogs/new', 
module.exports.newBlog = (req, res) => {
    res.render('blogs/new', { currentUser: req.user })
}

//post - '/blogs'
module.exports.createNewBlog = async(req ,res, next) =>{
    const blog = new Blog(req.body);
    blog.featured = req.body.featured;
    blog.author = req.user._id
    //console.log(blog.featured);
    //res.send(blog);
    await blog.save();
    res.redirect('/blogs');
}

// module.exports.createNewBlog = async (req, res, next) => {
//     // Create a new instance of the Blog model using data from the request body
//     const blogData = req.body;
//     const blog = new Blog(blogData);
    
//     // Set the author of the blog post to the ID of the current user
//     blog.author = req.user._id;

//     // Set the featured property based on the value sent from the form
//     blog.featured = (req.body.featured === 'true'); // Convert string 'true'/'false' to boolean
    
//     // Log the author ID to the console (optional, for debugging purposes)
//     console.log(blog.author);
    
//     // Save the newly created blog post to the database
//     await blog.save();
    
//     // Redirect the user to the '/blogs' route after successfully creating the blog post
//     res.redirect('/blogs');
// }

// get - '/blogs/:id'
module.exports.showBlog = async (req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate({
        path: 'comments', //populating with comments
        populate: {
            path: 'author' //adding comment author
        }})
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