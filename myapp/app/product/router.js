const router = require('express').Router()
const multer = require("multer")
const os = require('os')
const productController = require('./controller')
const { policeCheck }= require('../../middleware/index')

router.get('/products', productController.index)
router.get('/products/:id', productController.index)
router.post('/products', multer({ dest: os.tmpdir() }).single('image'),
    policeCheck('create', 'Product'),
productController.store);
router.put('/products/:id', multer({ dest: os.tmpdir() }).single('image'),
    policeCheck('update', 'Product'), 
productController.update)
router.delete('/products/:id', 
    policeCheck('delete', 'Product'), 
productController.destroy)

module.exports = router
