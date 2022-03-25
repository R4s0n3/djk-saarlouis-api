const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name:{type:String, required:true},
    prename:{type:String, required:true},
    age:{type:Date,required:true},
    image:{type:String,required:true},
    position:{type:String, required:true},
    team:{type:mongoose.Types.ObjectId, required:true, ref:"Team"},
    number:{type:Number}
    
},{ timestamps: {}});


module.exports = mongoose.model("Player", playerSchema);