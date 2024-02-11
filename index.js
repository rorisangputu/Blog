const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');


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

//USER AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/blog', (req, res) => {
    res.render('blogs/index')
})



app.listen(8080, ()=>{
    console.log("LISTENING ON PORT 8080")
})