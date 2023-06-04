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






module.exports= router;