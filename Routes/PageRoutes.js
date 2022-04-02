const express = require('express');
const router = express.Router();
const regController = require('../controllers/AuthProducts')


//list page
router.get('/', regController.getSupplier)

module.exports = router