const express = require('express');
const { deployApp } = require('../controllers/apicontroller');
const router = express.Router();

router.route('/app').get(deployApp);

module.exports = router;