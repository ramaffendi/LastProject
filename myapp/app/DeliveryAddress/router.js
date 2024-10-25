const router = require('express').Router()
const { policeCheck } = require('../../middleware')
const deliveryAddressController = require('./controller.js')

router.get('/delivery-addresses',
    policeCheck('view', 'DeliveryAddress'), deliveryAddressController.index)
router.post('/delivery-addresses',
    policeCheck('create', 'DeliveryAddress'), deliveryAddressController.store
)
router.put('/delivery-addresses/:id', deliveryAddressController.update)
router.delete('/delivery-addresses/:id', deliveryAddressController.destroy)

module.exports = router