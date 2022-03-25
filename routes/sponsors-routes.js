const express = require('express');
const {check} = require('express-validator'); // for signup validation
const sponsorsControllers = require('../controllers/sponsors-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

router.get('/', sponsorsControllers.getSponsors);
router.get('/:sid', sponsorsControllers.getSponsorById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',
fileUpload.array('image',1),
[
], sponsorsControllers.createSponsor);

router.patch('/:sid', sponsorsControllers.updateSponsor);
router.delete('/:sid', sponsorsControllers.deleteSponsor);


module.exports = router;