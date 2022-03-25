const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema; 

const teamSchema = new Schema({

    name:{type:String, required:true},
    status:{type:String,required:true},
    desc:{type:String,required:true},
    image:{type:String, required:true},
    players:[{type:mongoose.Types.ObjectId,required:true,ref:"Player"}],
    trainers:[{type:mongoose.Types.ObjectId, required:true, ref:"Trainer"}],
    trainings: [{type:mongoose.Types.ObjectId, required:true,ref:"Training"}],
    reports:[{type:mongoose.Types.ObjectId, required:true, ref:"Report"}],
    league:{type:String},
    gender:{type:String,required:true},
    insta:{type:String},
    fb:{type:String}


},{ timestamps: {} });

teamSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Team", teamSchema);