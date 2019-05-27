const express = require('express');
var path = require('path');
var coookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');

mongoose.connect('mongodb://localhost:27017/camagru', { useNewUrlParser: true } );
var db = mongoose.connection;
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
var routes = require('./routes/index');
var users = require('./routes/users');
var webcam = require('./routes/webcam');
var authRoutes = require('./routes/auth-routes');

var Gallery = require('express-photo-gallery');

const upload = require("./routes/upload");

//Init App
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(coookieParser());



//Set Static Folder
app.use(express.static(path.join(__dirname, './public'))); 
/*
app.post('/upload',(req, res) => {
  upload(req, res, (err) => {
      if(err){
        res.render('index', {
        
        });
      } else {
        console.log(req.file);
        res.send('test');
      }
  });
});
*/

//-----Manage the post requests.
app.post("/upload", (req, res, next)=>{
    //let multer manage the requests
    //which are passed to the upload function
    //by the main request.
    //the function if everything went right
    //will upload the file without cheking if already exists

   

    // ---------- MULTER UPLOAD FUNCTION -------------
    upload(req, res, function (err) {
        // need to check if the req.file is set.
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url            
            res.redirect("/webcam");
            
        }else{
            // An error occurred when uploading
            if (err) {
                console.log(err);
            }else{
                // Everything went fine
                //define what to do with the params
                //both the req.body and req.file(s) are accessble here
                console.log(req.file);
        
        
                //store the file name to mongodb    
                //we use the model to store the file.
                let image = new Image();
                image.image = req.file.filename;
        
                
        
                //save the image
                image.save(()=>{
                    if(err){
                        console.log(err);
                    }else{
                        //render the view again    
                        res.redirect("/webcam");
        
                    }
                });

            }
    
        }

    }); 


    
});
var options = {
  title: 'Gallery'
};

app.use('/gallery', Gallery('./public/images', options));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());



// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



//Middleware for routes
app.use('/', routes);
app.use('/users', users);
app.use('/webcam', upload);
//auth routes
app.use('/auth', authRoutes);

// Set Port
app.set('port', (process.env.PORT || 3002));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});