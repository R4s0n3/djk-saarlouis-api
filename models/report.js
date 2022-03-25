const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    team:{type:String, required: true},
    opponent:{type:String, required: true},
    homematch:{type:String, required:true},
    htshome:{type:Number, required:true},
    htsguest:{type:Number, required: true},
    eshome:{type:Number, required:true},
    esguest:{type:Number,required: true}
    
    
});

reportSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Report", reportSchema);