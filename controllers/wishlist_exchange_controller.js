const Game = require('../models/games');
const Exchange = require('../models/exchanges');
const { create } = require('connect-mongo');
const WishList = require('../models/wishlist');

exports.startExchange = (req, res, next) => {
    let id = req.params.id;

    Game.find({created_by: req.session.user, status:"Available"})
        .then(games => {
            res.render('./pages/initiateexchange',{games, id})
        })
        .catch(err=>next(err));
};

exports.addwishlist = (req, res, next) => {
    let id = req.params.id;
    console.log(id);
    Game.findById(id)
    .then(game =>{
        if(game) {
            if(game.created_by == req.session.user) {
                req.flash('error', "You are the owner of the app")
                res.redirect('/trades/'+id);
            }
            WishList.findOne
            let wishItem = new WishList();
            wishItem.item_name = game.name;
            wishItem.user_id = req.session.user;
            wishItem.item_id = id;
            wishItem.save()
            .then(list => res.redirect('back'))
            .catch(err=>{
                if(err.name === 'ValidationError') {
                    err.status = 400;
                }
                next(err);
            });
        } else {
            let err = new Error('Cannot find a game with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.deletewishlist = (req, res, next)=>{
    let id = req.params.id;
    WishList.findByIdAndDelete(id, {userFindAndModify: false})
    .then(game=>{
        if(game){
            res.redirect("back");
        } else {
            let err = new Error('Wishlist item not found' + id);
            err.status = 404;
            return next();
        }
    })
    .catch(err=>next(err));
};

exports.createExchange = async (req, res, next) => {
    let item_id = req.body.item_id;
    let trade_item_id = req.body.trade_item_id;
    console.log(item_id+" "+trade_item_id);
    if( item_id ===  trade_item_id) {
        let err = new Error("items cannot be same.");
        err.status = 422;
        return next();
    }

    let user_id = await Game.findById(item_id);
    let owner_id = await Game.findById(trade_item_id);


    if(user_id && owner_id) {
        user_id = user_id.created_by;
        owner_id = owner_id.created_by;
    } else {
        let err = new Error("Item Id not found " + item_id);
        err.status = 404;
        return next();
    }
    console.log(owner_id+" "+user_id);
    if( owner_id.equals(user_id)) {
        let err = new Error("items cannot be from same user.");
        err.status = 422;
        return next();
    }
    let create_exchange = new Exchange();
    create_exchange.initiator_id = user_id;
    create_exchange.owner_id = owner_id;
    create_exchange.item_id = item_id;
    create_exchange.exchange_item_id = trade_item_id;

    let exchange = await create_exchange.save();
    if(exchange) {
        Promise.all([
            Game.updateMany({_id: {$in:[item_id, trade_item_id]}}, {exchange_id: exchange.id, status: "Offer Pending"}, {useFindAndModify: false, runValidators: true}),
            // Game.findByIdAndUpdate(item_id, {status: "Offer Pending"}, {useFindAndModify: false, runValidators: true}),
            WishList.findOneAndUpdate({user_id: user_id, item_id: trade_item_id},{exchange_id: exchange.id}, {useFindAndModify: false, runValidators: true})
        ])
        .then(results => res.redirect('/user/profile'))
        .catch(err=>{
            if(err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
    } else {
        let err = new Error("Unable to create Exchange.");
        err.status = 422;
        return next();
    }
}

exports.viewexchange = (req, res, next) => {
    let exchange_id = req.params.id;
    Exchange.findById(exchange_id)
    .then(exchange => {
        console.log(exchange);
        if(!(exchange.owner_id.equals(req.session.user) || exchange.initiator_id.equals(req.session.user)))
        {
            let err = new Error("Unauthorized to access the resource");
            err.status = 401;
            return next(err);
        } else {
            Promise.all([Game.findById(exchange.item_id), Game.findById(exchange.exchange_item_id)])
            .then(result => {
                console.log(result)
                const [item1, item2] = result;
                let type = false;
                if(exchange.owner_id.equals(req.session.user))
                {
                    type = true;
                }
                res.render('./pages/viewexchange', {exchange, item1, item2, type});
            })
            
        }

    })
};

exports.respond = async (req, res, next) => {
    let exchange_id = req.params.id;
    let action = req.params.action;
    let exchange_details = await Exchange.findById(exchange_id);
    if(action == "accept") {
        Promise.all([
            Game.updateMany({_id: {$in:[exchange_details.item_id, exchange_details.exchange_item_id]}}, {exchange_id: null, status: "Traded"}, {useFindAndModify: false, runValidators: true}),
            WishList.findOneAndDelete({user_id: exchange_details.initiator_id, item_id: exchange_details.exchange_item_id}),
            WishList.findOneAndDelete({user_id: exchange_details.owner_id, item_id: exchange_details.item_id}),
            Exchange.findByIdAndDelete(exchange_details.id)
        ])
        .then(results=>{
            res.redirect('/user/profile');
        })
        .catch(err=>next(err));
    } else {
        Promise.all([
            Game.updateMany({_id: {$in:[exchange_details.item_id, exchange_details.exchange_item_id]}}, {exchange_id: null, status: "Available"}, {useFindAndModify: false, runValidators: true}),
            Exchange.findByIdAndDelete(exchange_details.id)
        ])
        .then(results => {
            res.redirect('/user/profile');
        })
        .catch(err=> next(err));
    }
}