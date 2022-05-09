const express  =require('express');
const controller = require('../controllers/user_controller.js')
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateLogin, validateResult, validateSignUp} = require('../middlewares/validator');

const router = express.Router();

router.get('/new', isGuest, controller.new);

router.post('/create', isGuest, validateSignUp, validateResult, controller.create);

router.get('/login', isGuest, controller.getUserLogin);

router.post('/login', logInLimiter, validateLogin, validateResult, isGuest, controller.login);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;