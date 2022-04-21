const model = require('../models/games');

exports.new = (req, res) =>{
    res.render('./pages/newtrade');
};

exports.index = function(req, res) {
    console.log("something missing");
    let categories = {};
    let games = model.find();
    model.find()
    .then(games => {
        games.forEach(game => {
            if(!(game.device_type in categories))
                categories[game.device_type] = [];
            categories[game.device_type].push(game)
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
    game.save()
    .then(game => res.redirect('trades'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid game id");
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(game =>{
        if(game) {
            return res.render('./pages/trade', {game});
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
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid game id");
        err.status = 400;
        return next(err);
    }
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
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid game id");
        err.status = 400;
        return next(err);
    }
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

exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid game id");
        err.status = 400;
        return next(err);
    }
    model.findByIdAndDelete(id, {userFindAndModify: false})
    .then(game=>{
        if(game){
            res.redirect("/trades");
        } else {
            let err = new Error('Cannot Find a game with id' + id);
            err.status = 404;
            return next
        }
    })
    .catch(err=>next(err));
};