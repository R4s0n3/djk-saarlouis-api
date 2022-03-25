const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingSchema = new Schema({
    start:{type:String,required:true},
    end:{type:String,required:true},
    day:{type:String,required:true},
    location:{type:String,required:true},
    link:{type:String,required:true},
    team:{type:mongoose.Types.ObjectId, required:true, ref:"Team"}
    
},{ timestamps: {} });

module.exports = mongoose.model("Training", trainingSchema);