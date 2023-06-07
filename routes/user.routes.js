const express = require('express');
const router = express.Router();
const User= require("../models/User.model");
const bcryptjs= require("bcryptjs");
const mongoose= require("mongoose");
const isLoggedIn = require("../utils/isLoggedIn");


router.get("/signup", (req, res, next) => {
    res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
  const username= req.body.username;
  const email= req.body.email;


  const password = req.body.password;

  let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if(!re.test(password)){
    //dont 4get to implement flash here!
    // req.flash("error", "password must contain lowercase, capital, numerals, and special characters");
    res.redirect("/signup");
    return;
  }

  const salt = await bcryptjs.genSalt(12)

  const hashedPassword= await bcryptjs.hash(password, salt)

  const newlyCreatedUser= await User.create({username:username, password: hashedPassword, email: email})

})

router.get("/login", (req, res, next) => {
res.render("users/login")
});

router.post("/login", (req, res, next) => {

  const username= req.body.username;
  const password= req.body.password;
  
  
  User.findOne({username: req.body.username})
  .then(foundUser => {
    if(!foundUser) {
      //add req.flash msg here

      res.redirect("/login");
      return;
    
    } else if(bcryptjs.compareSync(req.body.password, foundUser.password)) {

      if(!foundUser.active){
        res.redirect("/login");
        return;
      } else {
        req.session.currentUser= foundUser;
        //place success flash message here 
        res.redirect("/")
      }
      } else {
        //place flash message here error
        res.redirect("/login")
      }
    })
    .catch(error => next(error))
    });








module.exports= router;