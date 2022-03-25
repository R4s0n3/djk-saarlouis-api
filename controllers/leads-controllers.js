const { validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Lead = require('../models/lead');
const Team = require('../models/team');
const HttpError = require('../models/http-error');

const getLeads = async (req,res,next) =>{
    let leads;
    try{
        leads = await Lead.find({}).populate('category');
    }catch(err){
        const error = new HttpError(
            'Fetching leads failed, please try again later.',
            500
        );
        return next(error);

    }
    
    res.json({ leads: leads.map(lead => lead.toObject({ getters: true }))});
}

const createLead = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdLead;
    const {name, tel, email, prename,comment, category, image} = req.body;
    createdLead = new Lead({
          name,
          prename,
          comment,
          tel,
          email,
          category,
          image:req.files[0].location
          });
  



    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdLead.save({session:sess});
        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating lead failed, please try again.', 500);
        return next(error);
        }
        res.status(201).json({lead: createdLead.toObject({getters:true})});
        }


const getLeadById = async (req, res, next) => {
    const leadId = req.params.trid;

    let lead;
    try{
        lead = await Lead.findById(leadId).populate('team');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a lead.',
            500
        );
        return next(error);
    }
    if(!lead){
        const error = new HttpError(
            'Could not find a lead for the provided id.',
            404
        );
        return next(error);
    }
    res.json({lead: lead.toObject({getters:true})});
}
const updateLead = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {name, prename, tel, email, image, category} = req.body;
  
    const leadId = req.params.lid;
    let lead;
    try{
        lead = await Lead.findById(leadId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update lead',500
        );
        return next(error);
    }

    lead.name = name;
    lead.prename = prename;
    lead.category = category;
    lead.tel = tel;
    lead.email = email;
    lead.image = image || req.files[0].key;

    try{
        await lead.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update lead.',500
        );
        return next(error);
    }
    res.status(200).json({lead: lead.toObject({getters:true})});
}

const deleteLead = async (req, res, next) =>{
    const leadId = req.params.lid;
    let lead;
    try{
       lead = await Lead.findById(leadId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete lead.',
            500
        );
        return next(error);
    }

    if(!lead){
        const error = new HttpError('Could not find lead for this id.', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await lead.remove({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete lead.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted lead.'});
}

exports.deleteLead = deleteLead;
exports.updateLead = updateLead;
exports.getLeadById = getLeadById;
exports.getLeads = getLeads;
exports.createLead = createLead;