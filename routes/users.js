const express = require('express');
const router = express.Router();

//Get db Models
let User = require('../models/users');

// Register New User Route
router.get('/register',(req,res)=>{
  res.render('register_user',{
    title:'Register User'
  });
});

// Get user details Route
router.get('/:id',(req,res)=>{
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
  req.checkBody('mobilenumber','Mobile Number is required.').notEmpty();
  req.checkBody('password','Password is required.').notEmpty();
  req.checkBody('username','Username is required.').notEmpty();

  // Get errors
  let errors = req.validationErrors();
  if(errors){
    res.render('register_user',{
      title: 'Register User',
      errors: errors
    });
  }
  else{
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
        req.flash('success','User Added');
        res.redirect('/');
      }
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


module.exports = router;
