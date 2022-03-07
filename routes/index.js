const express = require('express');
const rootRouter = express.Router();

var trades = require('./trade.js');

rootRouter.use('/trades',trades);


// setup routes
rootRouter.get('/', function(req, res){
    res.render('pages/index');
});
rootRouter.get('/about', function(req, res){
    res.render('pages/about');
});
rootRouter.get('/contact', function(req, res){
    res.render('pages/contact');
});

rootRouter.use((req, res, next) => {
    let error = new Error('The sever cannot locate '+ req.url);
    error.status = 404;
    next(error);
});

rootRouter.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message - ("Internal server error");
    }
    res.status(err.status);
    res.render('./pages/error', {error: err});
});

module.exports = rootRouter;