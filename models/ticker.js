const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const liveSchema = new Schema({
    title:{type:String, required:true},
    link:{type:String},
    pages:[],
    published:{type:Boolean},
    timestamps:true
});


module.exports = mongoose.model("LiveTicker", liveSchema);