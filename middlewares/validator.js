const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//check if a given id is valid
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    }
}

exports.validateSignUp = [body('firstName','First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})];

exports.validateLogin = [body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and atmost 64 characters').isLength({min:8, max:64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=> {
            req.flash('error',error.msg);
        });
        return res.redirect('back');
    } else {
        return next();  
    }
};

exports.validateTrade = [body('name', 'Must give a name to the trade').notEmpty().trim().escape(),
body('category', 'Game category cannot be empty').notEmpty().trim().escape(),
body('description', 'The game description cannot be empty and must be minimum 10 characters in length').notEmpty().trim().escape().isLength({min: 10})];