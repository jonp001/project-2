const express = require('express');
const router= express.Router();
const Accessory= require("../models/Accessory.model");
const User= require("../models/User.model");
const isLoggedIn = require("../utils/isLoggedIn");
const uploader = require("../config/cloudinary");


router.get("/accessories/new", isLoggedIn, (req, res, next) => {
    res.render("accessories/new-accessory");
});

router.post ("/accessories/create", isLoggedIn, uploader.single("img"), (req, res, next) => {
    Accessory.create({
        seller: req.session.currentUser._id,
        img: req.file.path,
        title: req.body.accessoryTitle,
        description: req.body.accessoryDescription,
        price: req.body.price,
    }).then ((response) => {
        req.flash("success", "Accessory Successfully Listed");
        res.redirect("/accessories")
    })
  .catch((error) => next(error))
});

router.get("/accessories", (req, res, next) => {
    Accessory.find()
    .then()
    .then((allTheAccessories) =>{
        res.render("accessories/accessory-list", {accessories: allTheAccessories})
    })
    .catch((error) => next(error))
});






module.exports= router