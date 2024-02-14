const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const admin = require('../controllers/admin');

const auth = passport.authenticate('local', {failureFlash: true, failureRedirect: '/blogs'});

router.route('/adminRegister')
    .get(admin.renderAdminForm )
    .post(catchAsync (admin.registerAdmin))
    


module.exports = router;