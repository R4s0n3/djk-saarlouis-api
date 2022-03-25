const express = require('express');
const {check} = require('express-validator'); // for signup validation
const trainersControllers = require('../controllers/trainers-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', trainersControllers.getTrainers);
router.get('/:trid', trainersControllers.getTrainerById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',[
], trainersControllers.createTrainer);

router.patch('/:trid', trainersControllers.updateTrainer);
router.delete('/:trid', trainersControllers.deleteTrainer);


module.exports = router;