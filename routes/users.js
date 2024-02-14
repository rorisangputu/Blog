const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user');

const auth = passport.authenticate('local', {failureFlash: true, failureRedirect: '/blogs'});

router.route('/register')
    .get(users.renderRegisterForm )
    .post(catchAsync (users.registerUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, auth, users.loginUser)

router.get('/logout', users.logoutUser ); 

module.exports = router;