var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Image = require("../models/images");
//Get Hompage 
router.get('/',ensureAuthenticated, function(req, res){

Image.find({}, (err, docs) => {
  if(err){
    throw err;
  }
  let imagesPath = [];
  console.log(imagesPath);
  for (let i = 0;i < docs.length;i++){
    imagesPath.push(docs[i].image);
  }

  res.render('index', {images: imagesPath});
  
})
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg','You need to be logged in to see that page');
		res.redirect('users/login');
	}
}

function readFile(file) {
      var reader = new FileReader();
      reader.onloadend = function() {
        processFile(reader.result, file.type);
      };
      reader.onerror = function() {
        alert("There was an error reading the file!");
      };
      reader.readAsDataURL(file);
    }
    
module.exports = router;