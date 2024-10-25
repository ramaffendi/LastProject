const router = require('express').Router()
const { policeCheck, authenticateJWT } = require('../../middleware/index')
const cartController = require('./controller')

router.get('/carts', authenticateJWT, policeCheck('read', 'CartItems'), cartController.index);
router.put('/carts', authenticateJWT, policeCheck('update', 'CartItems'), cartController.update);
router.post('/carts', authenticateJWT, policeCheck('create', 'CartItems'), cartController.addToCart);
router.delete('/carts/:id', authenticateJWT, policeCheck('delete', 'CartItems'), cartController.deleteFromCart);

module.exports = router;