const express = require('express');
const {check} = require('express-validator'); // for signup validation
const leadsControllers = require('../controllers/leads-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload')
const router = express.Router();

router.get('/', leadsControllers.getLeads);
router.get('/:lid', leadsControllers.getLeadById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',
fileUpload.array('image',1),
[
], leadsControllers.createLead);

router.patch('/:lid', leadsControllers.updateLead);
router.delete('/:lid', leadsControllers.deleteLead);


module.exports = router;