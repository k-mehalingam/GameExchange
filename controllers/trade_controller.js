const model = require('../models/games');
const Exchanges = require('../models/exchanges');
const WishList = require('../models/wishlist');

exports.new = (req, res) =>{
    res.render('./pages/newtrade');
};

exports.index = function(req, res) {
    let categories = {};
    let games = model.find();
    model.find()
    .then(games => {
        games.forEach(game => {
            if(!(game.category in categories))
                categories[game.category] = [];
            categories[game.category].push(game)
        })
        res.render('./pages/trades', {categories});
    })
    .catch(err=>next(err)); 
};

exports.new = function(req, res) {
    res.render('./pages/newtrade');
};

exports.create = (req,res, next) => {
    let game = new model(req.body);
    game.created_by = req.session.user;
    game.save()
    .then(game => res.redirect('/trades'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let watch = null;
    let trade = null;
    if(req.session.user) {
        Promise.all([WishList.findOne({user_id: req.session.user, item_id: id}), Exchanges.findOne({initiator_id: req.session.user, exchange_item_id: id})])
        .then(results => {
            const [watch_item, trade_item] = results;
            if(watch_item) {
                watch = watch_item;
            } else {
                watch = null;
            }
            if(trade_item) {
                trade = trade_item;
            } else {
                trade = null;
            }
        });
    }
    model.findById(id).populate('created_by', 'firstName lastName')
    .then(game =>{
        // console.log(game);
        if(game) {
            // console.log(watch);
            return res.render('./pages/trade', {game, watch, trade});
        } else {
            let err = new Error('Cannot find a game with id' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(game =>{
        if(game) {
            return res.render('./pages/edittrade', {game});
        } else {
            let err = new Error('Cannot find a game with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let game = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, game, {useFindAndModify: false, runValidators: true})
    .then(game=>{
        if(game) {
            res.redirect('/trades/'+id);
        } else {
            let err = new Error(' Cannot find a game with id '+ id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === "ValidationError") {
            err.status = 400;
            next(err);
        }
    })
};

exports.delete = async (req, res, next) => {
    let id = req.params.id;
    let exchange_details = await Exchanges.find({$or: [{item_id: id},{exchange_item_id: id}]});
    // console.log(exchange_details);
    if(exchange_details.length) {
            await model.updateMany({_id: {$in:[exchange_details[0].item_id, exchange_details[0].exchange_item_id]}}, {exchange_id: null, status: "Available"}, {useFindAndModify: false, runValidators: true});
            await Exchanges.findByIdAndDelete(exchange_details[0].id);
    }
    await WishList.deleteMany({item_id: id});
    model.findByIdAndDelete(id, {userFindAndModify: false})
    .then(game=>{
        if(game){
            res.redirect("/trades");
        } else {
            let err = new Error('Cannot Find a game with id' + id);
            err.status = 404;
            return next();
        }
    })
    .catch(err=>next(err));
};