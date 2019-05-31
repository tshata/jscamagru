let mongoose = require("mongoose");

//create the Schema
let imagesSchema = mongoose.Schema({
    image : {
    	type : String,
        required: true
    },
    owner :
    {
    	type : String,
    	required: true
    },
    comment : {
    	type : String,
    },
    like : {
    	type : Number
    }

});

let Image= module.exports= mongoose.model("Image", imagesSchema);
//just the image is needed.