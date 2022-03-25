const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{type: String, required: true},
    content: {type: String, required: true},
    date: { type: String, required:true },
    creator:{ type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    image:{type:String, required:true},
    category:{ type: mongoose.Types.ObjectId, required: true, ref: 'Category'},
    report:{ type: mongoose.Types.ObjectId, ref: 'Report'},
    gallery:[],
    published:{ type: String, required:true },
    highlighted:{ type: String, required:true }
    
},{ timestamps: {} });


module.exports = mongoose.model("Post", postSchema);