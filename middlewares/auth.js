const Game = require('../models/games');
const Exchange = require('../models/exchanges');

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

exports.isAllowed = (req, res, next) => {
    let exchange_id = req.params.id;
    let action = req.params.action;
    Exchange.findById(exchange_id)
    .then(exchange_details => {
        if(!exchange_details) {
            let err = new Error("Offer Details not found");
            err.status = 404;
            return next(err);
        }
        // console.log(exchange_details);
        if((action == "accept" || action == "reject") && exchange_details.owner_id != req.session.user) {
            let err = new Error("Unauthorized to access the resource");
            err.status = 401;
            return next(err);
        } else if (action == "cancel" && exchange_details.initiator_id != req.session.user) {
            let err = new Error("Unauthorized to access the resource");
            err.status = 401;
            return next(err);
        }
        return next();
    })
    .catch(err=>next(err));
}