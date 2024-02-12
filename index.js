const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Blog = require('./models/blog');


mongoose.connect('mongodb://127.0.0.1:27017/blog')
.then(() =>{
    console.log("MONGO CONNECTION OPEN")
})
.catch(err =>{
    console.log("OH NO ERRROORRR!!")
    console.log(err)
})

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//USER AUTHENTICATION
// app.use(passport.initialize());
// app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//BLOG ROUTES
//View all blogs
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', {blogs})
})

app.get('/blogs/new', (req, res) => {
    res.render('blogs/new')
})

app.post('/blogs', async(req ,res) =>{
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect('/blogs');
})

app.get('/blogs/:id', async (req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    res.render('blogs/show', {blog})
})

app.get('/blogs/:id/edit', async (req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    res.render('blogs/edit', {blog})
})

app.put('/blogs/:id', async(req, res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/blogs/${blog._id}`)
})

app.delete('/blogs/:id', async (req, res) => {
    const {id} = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.redirect('/blogs')
})


app.listen(8080, ()=>{
    console.log("LISTENING ON PORT 8080")
})