var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('pages/index');
});

app.get('/about', function(req, res){
    res.render('pages/about');
});

app.get('/trades', function(req, res){
    res.render('pages/trades');
});

app.get('/trade', function(req, res){
    res.render('pages/trade');
});

app.get('/newtrade', function(req, res){
    res.render('pages/newtrade')
});

app.listen(8080);
