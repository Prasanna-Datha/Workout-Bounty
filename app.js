const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Init app database
mongoose.connect('mongodb://localhost/workoutbounty');
let db = mongoose.connection;

//Check db connection
db.once('open',()=>{
  console.log('Connected to MongoDB...');
});

//Check db errors
db.on('error',(err)=>{
  coonsole.log(err);
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

// Register New User Route
app.get('/register/user',(req,res)=>{
  res.render('register_user',{
    title:'Register User'
  });
});

// Get user details Route
app.get('/user/:id',(req,res)=>{
  User.findById(req.params.id,(err,user)=>{
    res.render('user',{
      user:user
    });
  });
});

app.post('/register/user',(req,res)=>{
  let user = new User();
  user.firstname = req.body.firstname;
  user.middlename = req.body.middlename;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.mobile_number = req.body.mobilenumber;
  user.password = req.body.password;
  user.username = req.body.username;

  user.save((err)=>{
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  });
  return;
});

//Start Server
app.listen(port,()=>{
  console.log("Server started on port "+port);
});
