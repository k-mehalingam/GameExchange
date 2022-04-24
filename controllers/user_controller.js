const User = require('../models/users');
const Game = require('../models/games');

exports.new = (req, res, next)=> {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(user=> {
        req.flash('success', "user created successfully")
        res.redirect('/user/login')
    })
    .catch(err=> {
        if(err.name === "ValidationError") {
            req.flash('error', err.message)
        }
    })
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error', 'email address not in use');
            res.redirect('/user/login');
        } else {
            user.comparePassword(password)
            .then(result => {
                if(result) {
                    req.session.user = user._id;
                    req.session.firstName = user.firstName;
                    req.session.lastName = user.lastName;
                    req.flash('success' , 'You have successfully logged in');
                    res.redirect('/user/profile');
                } else {
                    req.flash('error', 'wrong password');
                    res.redirect('/user/login');
                }
            });
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=> {
    let id = req.session.user;
    Promise.all([User.findById(id), Game.find({created_by: id})])
    .then(results => {
        const [user, games] = results;
        res.render('./user/profile', {user, games});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=> {
    req.session.destroy(err=> {
        if(err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};