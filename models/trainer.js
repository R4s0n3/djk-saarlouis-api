const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const trainerSchema = new Schema({
    name:{type:String, required:true},
    prename:{type:String, required:true},
    tel:{type:Number, required:true},
    email:{type:String,required:true},
    team:{type:mongoose.Types.ObjectId, required:true, ref:"Team"}
},{ timestamps: {} });

trainerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Trainer", trainerSchema);