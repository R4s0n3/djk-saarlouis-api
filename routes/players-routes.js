const express = require('express');
const {check} = require('express-validator'); // for signup validation
const playersControllers = require('../controllers/players-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', playersControllers.getPlayers);
router.get('/:plid', playersControllers.getPlayerById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',
fileUpload.array('image',1),
[
    check('name').not().isEmpty()
], playersControllers.createPlayer);

router.patch('/:plid', playersControllers.updatePlayer);
router.delete('/:plid', playersControllers.deletePlayer);


module.exports = router;