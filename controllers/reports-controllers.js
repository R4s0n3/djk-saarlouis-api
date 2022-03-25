const { validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Report = require('../models/report');

const HttpError = require('../models/http-error');

const getReports = async (req,res,next) =>{
    let reports;
    try{
        reports = await Report.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching reports failed, please try again later.',
            500
        )
    }
    
    res.json({ reports: reports.map(report => report.toObject({ getters: true }))});
}

const createReport = async (req,res,next) =>{
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
    let createdReport;
    const {team, opponent, homematch, htshome, htsguest, eshome, esguest } = req.body;
          createdReport = new Report({
            team,
            opponent,
            homematch,
            htshome,
            htsguest,
            eshome,
            esguest
          });
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdReport.save({session:sess});
        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating report failed, please try again.', 500);
        console.log(createdReport);
        return next(error);
        }
        res.status(201).json({repId: createdReport.id});
        }


const getReportById = async (req, res, next) => {
    const repId = req.params.rid;

    let report;
    try{
        report = await Report.findById(repId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a report.',
            500
        );
        return next(error);
    }
    if(!report){
        const error = new HttpError(
            'Could not find a report for the provided id.',
            404
        );
        return next(error);
    }
    res.json({report: report.toObject({getters:true})});
}

exports.getReportById = getReportById;
exports.getReports = getReports;
exports.createReport = createReport;