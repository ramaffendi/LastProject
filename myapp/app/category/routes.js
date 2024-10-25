const router = require("express").Router()
const categoryController = require("./controllers")
const {policeCheck} = require("../../middleware/index")

router.get('/categories', categoryController.index)
router.get('/categories/:id', categoryController.show); 

router.post('/categories', policeCheck('create', 'Category'),
    categoryController.store)
router.put('/categories/:id', policeCheck('update', 'Category'),
    categoryController.update)
router.delete('/categories/:id', policeCheck('delete', 'Category'),
    categoryController.destroy)

module.exports = router
