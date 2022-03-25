const express = require('express');
const {check} = require('express-validator'); // for signup validation
const checkAuth = require('../middleware/check-auth');

const reportsControllers = require('../controllers/reports-controllers');
const router = express.Router();

router.get('/', reportsControllers.getReports);
router.get('/:rid', reportsControllers.getReportById);
router.use(checkAuth);
router.post('/',reportsControllers.createReport);


module.exports = router;