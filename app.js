const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

// Init app database
mongoose.connect('mongodb://localhost/workoutbounty');
let db = mongoose.connection;

//Check db connection
db.once('open',()=>{
  console.log('Connected to MongoDB...');
});

//Check db errors
db.on('error',(err)=>{
  console.log(err);
});

// Init App
const app = express();
const port = 3000;

//Get db Models
let User = require('./models/users');

// Body Parser Middleware; application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Express Sesion Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
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

//Home Route
app.get('/',(req,res)=>{
  User.find({},(err,users)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('index',{
        title:'Workout Bounty - Home',
        users: users
      });
    }
  });


});

// Route Files
let users = require('./routes/users');
app.use('/users',users);

//Start Server
app.listen(port,()=>{
  console.log("Server started on port "+port);
});
