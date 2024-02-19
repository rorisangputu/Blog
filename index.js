if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //For boilerplate template
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./Utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport'); //User creation
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore  = require('connect-mongo');


//Route Files
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments')
//const dbUrl = 'mongodb://127.0.0.1:27017/blog'

const db_URL = process.env.DB_URL;
//Database connection string
mongoose.connect(db_URL)
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
app.use(mongoSanitize()); 


const store = MongoStore.create({
    mongoUrl: db_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

//SESSIONS
const sessionConfig = { //defines the configuration options for the session middleware.
    store,
    name: 'session',
    secret: 'thisisasecret', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//USER AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    console.log(req.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

//Routes
app.use('/blogs', blogRoutes);
app.use('/', adminRoutes);
app.use('/', userRoutes);
app.use('/blogs/:id/comments', commentRoutes);



app.get('/', (req, res ) =>{
    res.render('home')
});

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
});

//ERROR FEEDBACK
app.use((err, req, res, next) =>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(status).render('error', {err});
})

app.listen(8080, ()=>{
    console.log("LISTENING ON PORT 8080")
})