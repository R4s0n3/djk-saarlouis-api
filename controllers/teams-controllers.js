const { validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Team = require('../models/team');

const HttpError = require('../models/http-error');

const getTeams = async (req,res,next) =>{
    let teams;
    try{
        teams = await Team.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching teams failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ teams: teams.map(team => team.toObject({ getters: true }))});
}

const createTeam = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdTeam;
    const {name, status, desc, gender, league, insta, fb} = req.body;


          createdTeam = new Team({
           name,
           status,
           desc,
           players:[],
           trainers:[],
           trainings:[],
           gender,
           league,
           insta,
           reports:[],
           fb,
           image:req.files[0].location
          });
    try{

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTeam.save({session:sess});
        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating team failed, please try again.', 500);
        return next(error);
        }
        res.status(201).json({newTeam: createdTeam});
        }


const getTeamById = async (req, res, next) => {
    const teamId = req.params.tid;

    let team;
    try{
        team = await Team.findById(teamId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a team.',
            500
        );
        return next(error);
    }
    if(!team){
        const error = new HttpError(
            'Could not find a team for the provided id.',
            404
        );
        return next(error);
    }
    res.json({team: team.toObject({getters:true})});
}
const updateTeam = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {name, desc, agegrp, league, players, trainers, trainings, instalink, fblink} = req.body;
  
    const teamId = req.params.tid;
    let team;
    try{
        team = await Team.findById(teamId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update team',500
        );
        return next(error);
    }

    team.name = name;
    team.desc = desc;
    team.players = players;
    team.trainers = trainers;
    team.trainings = trainings;
    team.agegrp = agegrp;
    team.league = league;
    team.instalink = instalink;
    team.fblink = fblink;

    try{
        await team.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update team.',500
        );
        return next(error);
    }
    res.status(200).json({team: team.toObject({getters:true})});
}

const deleteTeam = async (req, res, next) =>{
    const teamId = req.params.tid;
    let team;
    try{
       team = await Team.findById(teamId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete team.',
            500
        );
        return next(error);
    }

    if(!team){
        const error = new HttpError('Could not find team for this id.',404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await team.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete team.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted team.'});
}

exports.deleteTeam = deleteTeam;
exports.updateTeam = updateTeam;
exports.getTeamById = getTeamById;
exports.getTeams = getTeams;
exports.createTeam = createTeam;