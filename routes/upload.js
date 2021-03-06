const express = require("express");
const route = express.Router();
// we need the file system to delete the images.
const fs = require("fs"); 
var users = require('./users');
var jimp = require('jimp');
//import mongoose
const mongoose = require("mongoose");

//multer config
const upload = require("../config/storage");

//Model
const Image = require("../models/images");

var ObjectId = require('mongodb').ObjectID;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','You need to be logged in to see that page');
        res.redirect('/');
    }
}


route.delete("/uploads/:id", ensureAuthenticated, (req,res)=>{
    //get the id from the ajax response
    //in this case the id is the name of the image
    //we need it in order to delete the image from the uploads directory
    let query= {image:req.params.id};

    Image.remove(query, (err)=>{
        if(err){
            console.log(err);
        }else{
            //delete the image from the directory
            //this is where we need the File System.
            //we use the params.id to find the file
            let $filePath= "./public/images/" + req.params.id
            fs.unlinkSync($filePath, (err)=>{
                if(err){
                    //send an error if the image was not deleted
                    console.log("couldnt delete " + req.params.id + " image");
                }
                                
                               
            });

            res.send("The image was deleted...");
        }
    });

 });

// route.save("/uploads/:id", (req,res)=>{
//     //get the id from the ajax response
//     //in this case the id is the name of the image
//     //we need it in order to delete the image from the uploads directory
//     let query= {image:req.params.id};

//     Image.save(query, (err)=>{
//         if(err){
//             console.log(err);
//         }else{
//             //delete the image from the directory
//             //this is where we need the File System.
//             //we use the params.id to find the file
//             let $filePath= "./public/images/" + req.params.id
//             fs.linkSync($filePath, (err)=>{
//                 if(err){
//                     //send an error if the image was not deleted
//                     console.log("couldnt save " + req.params.id + " image");
//                 }
                                
                               
//             });

//             res.send("The image was saved...");
//         }
//     });

//  });

 

//-----Manage the get requests.
route.get("/upload", ensureAuthenticated,(req, res, next)=>{
   //find the images inside mongodb
   Image.find({owner: req.user._id}, (err, images)=>{
    console.log(images);
       if(err){
           console.log(err);
       } else {
          let imagesPath = [];

          for (let i = 0;i < images.length;i++){
            imagesPath.push(images[i].image);
          }
           //return the array of images found.
           res.render("webcam", {
               images: imagesPath
           });
       } 
   });
   
    
});
// /users/webcam
route.get('/webcam', ensureAuthenticated, function(req, res){
    Image.find({owner: 'ObjectId(' + req.user.id + ')'}, (err, images)=>{
       console.log(images);
       if(err){
           console.log(err.message);
       } else {
          let imagesPath = [];

          for (let i = 0;i < images.length;i++){
            imagesPath.push(images[i].image.id);
          }
           //return the array of images found.
           res.render("webcam", {
               images: imagesPath
           });
       } 
     });
});

//jimp image merger

//-----Manage the post requests.
route.post("/upload", ensureAuthenticated, (req, res, next)=>{
    //let multer manage the requests
    //which are passed to the upload function
    //by the main request.
    //the function if everything went right
    //will upload the file without cheking if already exists

   
    // ---------- MULTER UPLOAD FUNCTION -------------
    upload(req, res, function (err) {
        // need to check if the req.file is set.
        console.log(req.user);
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url            
            res.redirect("/users/webcam");
            
        }else{
            // An error occurred when uploading
            if (err) {
                console.log(err.message);
            }else{
                // Everything went fine
                //define what to do with the params
                //both the req.body and req.file(s) are accessble here
         //       console.log(req.user);
        
        
                //store the file name to mongodb    
                //we use the model to store the file.
                let image = new Image();
                image.image = req.file.filename;
                image.owner = new ObjectId(req.user.id);
        
                //save the image
                image.save(()=>{
                    if(err){
                        console.log(err);
                    }else{
                        //render the view again    
                        res.render("webcam");
        
                    }
                });

            }
    
        }

    }); 


    
});



//export the module
module.exports = route;
