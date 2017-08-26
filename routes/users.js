const express = require('express');
const router = express.Router();
const bcrypt =  require('bcryptjs');
const passport = require('passport');

//Get db Models
let User = require('../models/users');

// Register New User Route
router.get('/register',(req,res)=>{
  res.render('register_user',{
    title:'Register User'
  });
});

// Login User Route
router.get('/login',(req,res)=>{
  res.render('login',{
    title:'Login'
  });
});

// Login Process
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});

//  logout
router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success','You have logged out successfully');
  res.redirect('/users/login');
});



router.get('/registered_users',ensureAuthenticated,(req,res)=>{
  User.find({},(err,users)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('registered_users',{
        title:'Workout Bounty - Home',
        users: users
      });
    }
  });
});

// Get user details Route
router.get('/:id',ensureAuthenticated,(req,res)=>{
  User.findById(req.params.id,(err,user)=>{
    res.render('user',{
      user:user
    });
  });
});

router.post('/register',(req,res)=>{
  req.checkBody('firstname','Firstname is required.').notEmpty();
  req.checkBody('lastname','Lastname is required.').notEmpty();
  req.checkBody('email','Email is required.').notEmpty();
  req.checkBody('email','Email not valid').isEmail();
  req.checkBody('mobilenumber','Mobile Number is required.').notEmpty();
  req.checkBody('username','Username is required.').notEmpty();
  req.checkBody('password','Password is required.').notEmpty();
  req.checkBody('reenterpass','Passwords do not match').equals(req.body.password);


  // Get errors
  let errors = req.validationErrors();
  if(errors){
    res.render('register_user',{
      title: 'Register User',
      errors: errors
    });
  }
  else{
    let newUser = new User();
    newUser.firstname = req.body.firstname;
    newUser.middlename = req.body.middlename;
    newUser.lastname = req.body.lastname;
    newUser.email = req.body.email;
    newUser.mobile_number = req.body.mobilenumber;
    newUser.password = req.body.password;
    newUser.username = req.body.username;

    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(newUser.password,salt,(err,hash)=>{
        if(err){
          console.log(err);
        }
        newUser.password = hash;

        newUser.save((err)=>{
          if(err){
            console.log(err);
            return;
          }else{
            req.flash('success','User Added');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});


// Edit user details Route
router.get('/edit/:id',(req,res)=>{
  User.findById(req.params.id,(err,user)=>{
    res.render('edit_user',{
      title:'Edit User Details',
      user:user
    });
  });
});

// Edit user details
router.post('/edit/:id',(req,res)=>{
  let user = {};
  user.firstname = req.body.firstname;
  user.middlename = req.body.middlename;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.mobile_number = req.body.mobilenumber;
  user.password = req.body.password;
  user.username = req.body.username;

  let query={_id:req.params.id};

  User.update(query,user,(err)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('success','User Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id',(req,res)=>{
  let query = {_id:req.params.id}

  User.remove(query,(err)=>{
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});



function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    req.flash('danger','Please login to continue...!!!');
    res.redirect('/users/login');
  }
}


module.exports = router;
