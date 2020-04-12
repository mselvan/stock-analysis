const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data-controller')

router.get('/plots', dataController.plots);

module.exports = router;