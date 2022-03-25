const { validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Sponsor = require('../models/sponsor');
const Team = require('../models/team');
const HttpError = require('../models/http-error');

const getSponsors = async (req,res,next) =>{
    let sponsors;
    try{
        sponsors = await Sponsor.find({}).populate('category');
    }catch(err){
        const error = new HttpError(
            'Fetching sponsors failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ sponsors: sponsors.map(sponsor => sponsor.toObject({ getters: true }))});
}

const createSponsor = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdSponsor;
    const {name, link, category, image} = req.body;
    createdSponsor = new Sponsor({
          name,
          link,
          category,
          image:req.files[0].location
          });


    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdSponsor.save({session:sess});
        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating sponsor failed, please try again.', 500);
        return next(error);
        }
        res.status(201).json({sponsor: createdSponsor.toObject({getters:true})});
        }


const getSponsorById = async (req, res, next) => {
    const sponsorId = req.params.sid;

    let sponsor;
    try{
        sponsor = await Sponsor.findById(sponsorId).populate('team');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a sponsor.',
            500
        );
        return next(error);
    }
    if(!sponsor){
        const error = new HttpError(
            'Could not find a sponsor for the provided id.',
            404
        );
        return next(error);
    }
    res.json({sponsor: sponsor.toObject({getters:true})});
}
const updateSponsor = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {name, prename, tel, email, image, category} = req.body;
  
    const sponsorId = req.params.sid;
    let sponsor;
    try{
        sponsor = await Sponsor.findById(sponsorId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update sponsor',500
        );
        return next(error);
    }

    sponsor.name = name;
    sponsor.category = category;
    sponsor.link = email;
    sponsor.image = image || req.files[0].key;

    try{
        await sponsor.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update sponsor.',500
        );
        return next(error);
    }
    res.status(200).json({sponsor: sponsor.toObject({getters:true})});
}

const deleteSponsor = async (req, res, next) =>{
    const sponsorId = req.params.sid;
    let sponsor;
    try{
       sponsor = await Sponsor.findById(sponsorId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete sponsor.',
            500
        );
        return next(error);
    }

    if(!sponsor){
        const error = new HttpError('Could not find sponsor for this id.', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await sponsor.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete sponsor.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted sponsor.'});
}

exports.deleteSponsor = deleteSponsor;
exports.updateSponsor = updateSponsor;
exports.getSponsorById = getSponsorById;
exports.getSponsors = getSponsors;
exports.createSponsor = createSponsor;