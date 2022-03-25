const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const leadSchema = new Schema({
    name:{type:String, required:true},
    prename:{type:String, required: true},
    tel:{type:Number},
    image:{type:String,required:true},
    category:{ type: mongoose.Types.ObjectId, required: true, ref: 'Category'},
    email:{type:String, required:true},
    comment:{type:String, required:true}    

});

leadSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Lead", leadSchema);