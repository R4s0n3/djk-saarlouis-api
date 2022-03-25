const { validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Team = require('../models/team');
const HttpError = require('../models/http-error');

const getTrainers = async (req,res,next) =>{
    let trainers;
    try{
        trainers = await Trainer.find({}).populate('team');
    }catch(err){
        const error = new HttpError(
            'Fetching trainers failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ trainers: trainers.map(trainer => trainer.toObject({ getters: true }))});
}

const createTrainer = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdTrainer;
    const {name, tel, email, prename,team} = req.body;
    createdTrainer = new Trainer({
          name,
          prename,
          tel,
          email,
          team
          });
          let trainerTeam;
          try{
             trainerTeam = await Team.findById(team);
        }catch(err){
            const error = new HttpError(
                'Creating trainer failed, please try again.',
                500
            );
            return next(error);
        }
  
        if(!team){
          const error = new HttpError('could not find a team for the provided user id.', 404);
          return next(error);
        }      



    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTrainer.save({session:sess});
        trainerTeam.trainers.push(createdTrainer);
        await trainerTeam.save({session:sess});

        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating trainer failed, please try again.', 500);
        return next(error);
        }
        res.status(201).json({trainer: createdTrainer.toObject({getters:true})});
        }


const getTrainerById = async (req, res, next) => {
    const trainerId = req.params.trid;

    let trainer;
    try{
        trainer = await Trainer.findById(trainerId).populate('team');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a trainer.',
            500
        );
        return next(error);
    }
    if(!trainer){
        const error = new HttpError(
            'Could not find a trainer for the provided id.',
            404
        );
        return next(error);
    }
    res.json({trainer: trainer.toObject({getters:true})});
}
const updateTrainer = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {name, tel, email, image} = req.body;
  
    const trainerId = req.params.trid;
    let trainer;
    try{
        trainer = await Trainer.findById(trainerId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update trainer',500
        );
        return next(error);
    }

    trainer.name = name;
    trainer.tel = tel;
    trainer.email = email;
    trainer.image = image || req.files[0].key;

    try{
        await trainer.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update trainer.',500
        );
        return next(error);
    }
    res.status(200).json({trainer: trainer.toObject({getters:true})});
}

const deleteTrainer = async (req, res, next) =>{
    const trainerId = req.params.trid;
    let trainer;
    try{
       trainer = await Trainer.findById(trainerId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete trainer.',
            500
        );
        return next(error);
    }

    if(!trainer){
        const error = new HttpError('Could not find trainer for this id.', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await trainer.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete trainer.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted trainer.'});
}

exports.deleteTrainer = deleteTrainer;
exports.updateTrainer = updateTrainer;
exports.getTrainerById = getTrainerById;
exports.getTrainers = getTrainers;
exports.createTrainer = createTrainer;