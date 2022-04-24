const Game = require('../models/games');

exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', "you are logged in already");
        return res.redirect('/user/profile');
    }
};


exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/user/login');
    }
};


exports.isOwner = (req, res, next) => {
    let id = req.params.id;
    Game.findById(id)
    .then(game =>{
        if(game) {
            if(game.created_by == req.session.user){
                return next();
            } else {
                let err = new Error("Unauthorized to access the resource");
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err=>next(err));

};