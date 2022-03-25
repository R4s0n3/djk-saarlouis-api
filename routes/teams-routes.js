const express = require('express');
const {check} = require('express-validator'); // for signup validation
const teamsControllers = require('../controllers/teams-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

router.get('/', teamsControllers.getTeams);
router.get('/:tid', teamsControllers.getTeamById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',
fileUpload.array('image',1),

[
], teamsControllers.createTeam);

router.delete('/:tid', teamsControllers.deleteTeam);


module.exports = router;