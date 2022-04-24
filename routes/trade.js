const express  =require('express');
const controller = require('../controllers/trade_controller.js')
const {isLoggedIn, isOwner} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');
const router = express.Router();


router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.get('/:id', validateId,controller.show);

router.post('/', isLoggedIn,controller.create);

router.get('/:id/edit', isLoggedIn, validateId, isOwner, controller.edit)

router.put('/:id', isLoggedIn, validateId, isOwner, controller.update);

router.delete('/:id', isLoggedIn, validateId, isOwner, controller.delete);

module.exports = router;