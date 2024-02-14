const User = require('../models/user');

module.exports.renderAdminForm = (req, res) => {
    res.render('admin/adminRegister');
}

module.exports.registerAdmin = async(req, res, next) =>{
    try {
        const { email, username, password, isAdmin } = req.body;
        const userAdmin = new User ({email, username, isAdmin: true});
        console.log(userAdmin);
        const registeredUser = await User.register(userAdmin, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/blogs');
        });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }   
}