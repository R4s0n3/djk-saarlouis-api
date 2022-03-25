const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const sponsorSchema = new Schema({
    
    name:{type:String, required:true},
    link:{type:String, required:true},
    image:{type:String, required:true},
    category:{ type: mongoose.Types.ObjectId, required: true, ref: 'Category'}

});

sponsorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sponsor", sponsorSchema);