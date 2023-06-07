const express = require('express');
const router = express.Router();
const User= require("../models/User.model");
const bcryptjs= require("bcryptjs");
const mongoose= require("mongoose");
const isLoggedIn = require("../utils/isLoggedIn");


router.get("/signup", (req, res, next) => {
    res.render("users/signup");
});

router.post("/signup", (req, res, next) => {
  const numberOfRounds = 12;
  const username= req.body.username;
  const email= req.body.email;
  const password = req.body.password;

  let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if(!re.test(password)){
    req.flash("error", "password must contain lowercase, capital, numerals, and special characters");
    res.redirect("/signup");
    return;
  }

  bcryptjs
  .genSalt(numberOfRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {

    User.create({username:username, password: hashedPassword, email: email})
    .then(() => {
    req.flash("success", "Sign-up was Successful!")
    res.redirect("/")
  })
    .catch(error => {
      if(error instanceof mongoose.Error) {
          req.flash("error", error.message);
          res.redirect("/signup");
      }
  })
})

.catch((error) => next(error))
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
      req.flash("error", "No User Found")

      res.redirect("/login");
      return;
    
    } else if(bcryptjs.compareSync(req.body.password, foundUser.password)) {
      req.session.currentUser= foundUser;
   
      req.flash("success", "Successfully logged in")
      res.redirect("/");
    } else {
      req.flash("error", "Password Does NOT match");
      res.redirect("/login");
    }
  })
    .catch(error => next(error))
    });

  
  router.post("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/")
  });

  router.get("/user-profile", isLoggedIn, (req, res, next) => {
    User.findById(req.session.currentUser._id).populate("bicycle")
    .then((theUser) => {
      res.render("users/user-profile", {theUser: theUser})
    })
  })









module.exports= router;