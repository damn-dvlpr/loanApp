const express = require('express');

const viewsController = require('../controllers/viewsController');
const searchController = require('../controllers/searchController');

const router = express.Router();

router
	.route('/')
	.get(viewsController.getSearchView)
	.post(searchController.findGirvi);

module.exports = router;
