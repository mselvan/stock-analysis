const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data-controller')
const path = require('path');

router.get('/plots', dataController.plots);

module.exports = router;