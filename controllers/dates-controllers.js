const { validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Date = require('../models/date');
const Team = require('../models/team');

const HttpError = require('../models/http-error');

const getDates = async (req,res,next) =>{
    let dates;
    try{
        dates = await Date.find({}).populate('team').populate('category');
    }catch(err){
        const error = new HttpError(
            'Fetching teams failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ dates: dates.map(date => date.toObject({ getters: true }))});
}

const createDate = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdDate;
    const {title, category, team, opponent, homegame, date} = req.body;
    createdDate = new Date({
        title,
        category,
        team,
        opponent,
        homegame,
        date
          });

          let dateTeam;
          try{
             dateTeam = await Team.findById(team);
        }catch(err){
            const error = new HttpError(
                'Creating date failed, please try again.',
                500
            );
            return next(error);
        }
  
   



    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdDate.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Creating date failed, please try again2.', 500);
        return next(error);
        }
        res.status(201).json({date: createdDate.toObject({getters:true})});
        }


const getDateById = async (req, res, next) => {
    const dateId = req.params.did;

    let date;
    try{
        date = await Date.findById(dateId).populate('team');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a date.',
            500
        );
        return next(error);
    }
    if(!date){
        const error = new HttpError(
            'Could not find a date for the provided id.',
            404
        );
        return next(error);
    }
    res.json({date: date.toObject({getters:true})});
}
const updateDate = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, category, team, opponent, homegame} = req.body;
  
    const dateId = req.params.did;
    let date;
    try{
        date = await Date.findById(dateId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update date',500
        );
        return next(error);
    }

    date.title = title;
    date.category = category;
    date.team = team;
    date.opponent = opponent;
    date.homegame = homegame;

    try{
        await date.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update date.',500
        );
        return next(error);
    }
    res.status(200).json({date: date.toObject({getters:true})});
}

const deleteDate = async (req, res, next) =>{
    const dateId = req.params.did;
    let date;
    try{
       date = await Date.findById(dateId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete date.',
            500
        );
        return next(error);
    }

    if(!date){
        const error = new HttpError('Could not find date for this id.',404);
        return next(error);
    }



    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await date.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete date.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted date.'});
}

exports.deleteDate = deleteDate;
exports.updateDate = updateDate;
exports.getDateById = getDateById;
exports.getDates = getDates;
exports.createDate = createDate;