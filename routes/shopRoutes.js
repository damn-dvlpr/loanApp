const express = require('express');

const shopController = require('../controllers/shopController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router
	.route('/')
	.get(viewsController.getShopView)
	.post(shopController.createGirvi);
router.get('/new', viewsController.getNewGirviView);
router.get('/:id', viewsController.getGirviView);
router.get('/:id/passbook/new', viewsController.getNewPassbookFormView);

router.post('/:id/passbook', shopController.createPassbook);
router.post('/:id/delivered', shopController.updateGirvi);
router.delete('/:id', shopController.deleteGirvi);

module.exports = router;
