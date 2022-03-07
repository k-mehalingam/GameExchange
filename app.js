// importing required modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
var rootRouter = require('./routes');

//creating the app
const app = express();

//configuring the app
let port = 8000;
let host = 'localhost';
app.set('view engine', 'ejs');

//setup middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'))
app.use(methodOverride('_method'));

//adding the main router
app.use('/', rootRouter);

app.listen(port, host, ()=>{
    console.log('Server is running on', port);
})
