// importing required modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
var rootRouter = require('./routes');
const mongoose = require('mongoose');

//creating the app
const app = express();

//configuring the app
let port = 8000;
let host = 'localhost';
app.set('view engine', 'ejs');

//using mongoose to connect with database
mongoose.connect('mongodb://localhost:27017/GamesDB', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    //starting the server if mongodb connected
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

//setup middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'))
app.use(methodOverride('_method'));

//adding the main router
app.use('/', rootRouter);
