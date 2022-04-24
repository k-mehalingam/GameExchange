// importing required modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
var rootRouter = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


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

//add session control
app.use(
    session({
        secret: "ada2ulagai5rasika9vendum8naan1un2pondra5pennodu",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/GamesDB'}),
        cookie: {maxAge: 60*60*1000}
    })
);

//add use of flash message
app.use(flash());

//user local storage
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.firstName = req.session.firstName || null;
    res.locals.lastName = req.session.lastName || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

//setup middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'))
app.use(methodOverride('_method'));

//adding the main router
app.use('/', rootRouter);
