const express = require('express');
const {check} = require('express-validator'); // for signup validation
const tickersControllers = require('../controllers/tickers-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', tickersControllers.getTrickers);
router.get('/:ltid', tickersControllers.getTickerById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',[
    check('content').not().isEmpty()
], tickersControllers.createTicker);

router.patch('/:ltid', tickersControllers.updateTicker);
router.delete('/:ltid', tickersControllers.deleteTickerr);


module.exports = router;