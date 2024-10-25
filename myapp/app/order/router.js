const router = require('express').Router()
const { policeCheck } = require('../../middleware')
const orderController = require('./controller')

router.get('/orders', policeCheck('view', 'Order'), orderController.index)
router.post('/orders', policeCheck('create', 'Order'), orderController.store)

module.exports = router