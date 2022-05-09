const express  =require('express');
const controller = require('../controllers/trade_controller.js')
const exchange_controller = require("../controllers/wishlist_exchange_controller");
const {isLoggedIn, isOwner, isAllowed} = require('../middlewares/auth');
const {validateId, validateResult, validateTrade} = require('../middlewares/validator');
const router = express.Router();


router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.get('/:id', validateId,controller.show);

router.post('/', isLoggedIn,controller.create);

router.get('/:id/edit', isLoggedIn, validateId, isOwner, controller.edit)

router.put('/:id', isLoggedIn, validateId, isOwner, controller.update);

router.delete('/:id', isLoggedIn, validateId, isOwner, controller.delete);

router.post('/exchange', isLoggedIn, exchange_controller.createExchange);

router.get('/newexchange/:id', isLoggedIn, validateId, exchange_controller.startExchange);

router.post('/wishlist/:id', isLoggedIn, validateId, exchange_controller.addwishlist);

router.delete('/wishlist/:id', isLoggedIn, validateId, exchange_controller.deletewishlist);

router.get('/viewexchange/:id', isLoggedIn, validateId, exchange_controller.viewexchange);

router.get('/respondoffer/:id/:action', isLoggedIn, validateId, isAllowed, exchange_controller.respond);

module.exports = router;