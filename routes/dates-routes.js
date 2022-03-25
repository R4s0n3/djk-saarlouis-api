const express = require('express');
const {check} = require('express-validator'); // for signup validation
const datesControllers = require('../controllers/dates-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', datesControllers.getDates);
router.get('/:did', datesControllers.getDateById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',[
], datesControllers.createDate);

router.patch('/:did', datesControllers.updateDate);
router.delete('/:did', datesControllers.deleteDate);


module.exports = router;