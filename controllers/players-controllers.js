const { validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Player = require('../models/player');
const Team = require('../models/team');

const HttpError = require('../models/http-error');

const getPlayers = async (req,res,next) =>{
    let players;
    
    try{
        players = await Player.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching teams failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ players: players.map(player => player.toObject({ getters: true }))});
}

const createPlayer = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdPlayer;
    const {name, prename, age, position, number, team} = req.body;
    createdPlayer = new Player({
        
          name,
          prename,
          age,
          team,
          position,
          number,
          image:req.files[0].location
          
          });

          let playerTeam;
          try{
             playerTeam = await Team.findById(team);
          }catch(err){
              const error = new HttpError(
                  'Creating post failed, please try again1.',
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
        await createdPlayer.save({session:sess});
        playerTeam.players.push(createdPlayer);
        await playerTeam.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Creating player failed, please try again.', 500);
        return next(error);
        }
        res.status(201).json({player: createdPlayer.toObject({getters:true})});
        }


const getPlayerById = async (req, res, next) => {
    const playerId = req.params.plid;

    let player;
    try{
        player = await Player.findById(playerId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a player.',
            500
        );
        return next(error);
    }
    if(!player){
        const error = new HttpError(
            'Could not find a player for the provided id.',
            404
        );
        return next(error);
    }
    res.json({player: player.toObject({getters:true})});
}
const updatePlayer = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {name, prename, age, position, number, image} = req.body;
  
    const playerId = req.params.plid;
    let player;
    try{
        player = await Player.findById(playerId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update player.',500
        );
        return next(error);
    }

    player.name = name;
    player.prename = prename;
    player.age = age;
    player.position = position;
    player.number = number;
    player.image = image || req.files[0].key;

    try{
        await player.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update player.',500
        );
        return next(error);
    }
    res.status(200).json({player: player.toObject({getters:true})});
}

const deletePlayer = async (req, res, next) =>{
    const playerId = req.params.plid;
    let player;
    try{
       player = await Player.findById(playerId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete player.',
            500
        );
        return next(error);
    }

    if(!player){
        const error = new HttpError('Could not find player for this id.',404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await player.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete player.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted player.'});
}

exports.deletePlayer = deletePlayer;
exports.updatePlayer = updatePlayer;
exports.getPlayerById = getPlayerById;
exports.getPlayers = getPlayers;
exports.createPlayer = createPlayer;