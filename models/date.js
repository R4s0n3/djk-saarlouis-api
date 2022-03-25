const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dateSchema = new Schema({
    
    title:{type:String, required:true},
    date:{type:Date, default: Date.now},
    category:{ type: mongoose.Types.ObjectId, required: true, ref: 'Category'},
    team:{type:mongoose.Types.ObjectId, ref:'Team'},
    opponent:{type:String},
    homegame:{type:Boolean}

});


module.exports = mongoose.model("Date", dateSchema);