const model = require('../models/games');

exports.new = (req, res) =>{
    res.render('./pages/newtrade');
};

exports.index = function(req, res) {
    console.log("something missing");
    let categories = {};
    let games = model.find();

    games.forEach((game) => {
        console.log(game.device_type);
        if(!(game.device_type in categories))
            categories[game.device_type] = [];
        categories[game.device_type].push(game)
    });
    console.log(categories);
    res.render('./pages/trades', {categories});
};

exports.new = function(req, res) {
    res.render('./pages/newtrade');
};

exports.create = function(req,res) {
    let game = req.body;
    console.log(game);
    model.save(game);
    res.redirect('/trades');
};

exports.show = (req, res, next) => {
    console.log(req.params);
    let id = req.params.id;
    let game = model.findById(id);
    console.log(game);
    if(game) {
        res.render('./pages/trade', {game});
    } else {
        let error={};
        error['status'] = 404;
        error['message'] = "Cannot find game with id "+id;
        res.render('./pages/error', {error});
    }
}

exports.edit = function(req, res) {
    let id = req.params.id;
    let game = model.findById(id);
    if(game) {
        res.render('./pages/edittrade', {game})
    } else {
        let error={};
        error['status'] = 404;
        error['message'] = "Cannot find game with id " + id;
        res.render('./pages/error', {error});
        
    }
}

exports.update = function(req, res) {
    let game = req.body;
    let id = req.params.id;

    if(model.updateById(id, game)) {
        res.redirect('/trades/'+id)
    } else {
        let error={};
        error['status'] = 404;
        error['message'] = "Cannot find game with id " + id;
        res.render('./pages/error', {error});
    }
}

exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(model.deleteById(id)) {
        res.redirect("/trades");
    } else {
        let error={};
        error['status'] = 404;
        error['message'] = "Cannot find game with id " + id;
        res.render('./pages/error', {error});
    }
};