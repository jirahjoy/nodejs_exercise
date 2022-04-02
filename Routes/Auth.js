const express = require('express');
const router = express.Router();
const regController = require('../controllers/AuthProducts')
//will call the functions
router.post('/addProduct', regController.addProducts);
router.get('/getList', regController.getList);
router.get('/', regController.getSupplier);
router.get('/deleteForm/:product_id', regController.deleteForm);
router.get('/updateForm/:product_id', regController.editProducts);
router.post('/editProductsItems', regController.editProductsItems);


module.exports = router;
