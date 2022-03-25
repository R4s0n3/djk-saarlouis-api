const express = require('express');
const {check} = require('express-validator'); // for signup validation
const trainingsControllers = require('../controllers/trainings-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', trainingsControllers.getTrainings);
router.get('/:trid', trainingsControllers.getTrainingById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',[
], trainingsControllers.createTraining);

router.patch('/:trid', trainingsControllers.updateTraining);
router.delete('/:trid', trainingsControllers.deleteTraining);


module.exports = router;