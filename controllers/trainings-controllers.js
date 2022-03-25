const { validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Training = require('../models/training');
const Team = require('../models/team');

const HttpError = require('../models/http-error');

const getTrainings = async (req,res,next) =>{
    let trainings;
    try{
        trainings = await Training.find({}).populate('team');
    }catch(err){
        const error = new HttpError(
            'Fetching teams failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ trainings: trainings.map(training => training.toObject({ getters: true }))});
}

const createTraining = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdTraining;
    const {start, end, day, location, link, team } = req.body;
    createdTraining = new Training({
          start,
          end,
          day,
          location,
          link,
          team
          });

          let trainingTeam;
          try{
             trainingTeam = await Team.findById(team);
        }catch(err){
            const error = new HttpError(
                'Creating training failed, please try again.',
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
        await createdTraining.save({session:sess});
        trainingTeam.trainings.push(createdTraining);
        await trainingTeam.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Creating training failed, please try again2.', 500);
        return next(error);
        }
        res.status(201).json({training: createdTraining.toObject({getters:true})});
        }


const getTrainingById = async (req, res, next) => {
    const trainingId = req.params.trid;

    let training;
    try{
        training = await Training.findById(trainingId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a training.',
            500
        );
        return next(error);
    }
    if(!training){
        const error = new HttpError(
            'Could not find a training for the provided id.',
            404
        );
        return next(error);
    }
    res.json({training: training.toObject({getters:true})});
}
const updateTraining = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {start, end, day, location, link} = req.body;
  
    const trainingId = req.params.trid;
    let training;
    try{
        training = await Training.findById(trainingId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update training',500
        );
        return next(error);
    }

    training.start = start;
    training.end = end;
    training.day = day;
    training.location = location;
    training.link = link;

    try{
        await training.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update training.',500
        );
        return next(error);
    }
    res.status(200).json({training: training.toObject({getters:true})});
}

const deleteTraining = async (req, res, next) =>{
    const trainingId = req.params.trid;
    let training;
    try{
       training = await Training.findById(trainingId).populate('team');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete training.',
            500
        );
        return next(error);
    }

    if(!training){
        const error = new HttpError('Could not find training for this id.',404);
        return next(error);
    }



    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await training.remove({session:sess});
        training.team.trainings.pull(training);
        await training.team.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete training.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted training.'});
}

exports.deleteTraining = deleteTraining;
exports.updateTraining = updateTraining;
exports.getTrainingById = getTrainingById;
exports.getTrainings = getTrainings;
exports.createTraining = createTraining;