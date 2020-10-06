const express = require('express');

const utilsController = require('../controllers/utilsController');

const router = express.Router();

router.route('/:id').get(utilsController.getPrintReciept);

module.exports = router;
