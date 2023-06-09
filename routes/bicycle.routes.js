const express = require('express');
const router= express.Router();
const Bicycle= require("../models/Bicycle.model");
const User= require("../models/User.model");
const isLoggedIn = require("../utils/isLoggedIn");
const uploader = require("../config/cloudinary");


router.get("/bicycles/new", isLoggedIn, (req, res, next) => {
    res.render("bicycles/new-bicycle");
});


router.post ("/bicycles/create", isLoggedIn, uploader.single("img"), (req, res, next) => {

    Bicycle.create({
        img: req.file.path,
        title: req.body.bicycleTitle,
        year: req.body.bicycleYear,
        brand: req.body.bicycleBrand,
        model: req.body.bicycleModel,
        description: req.body.bicycleDescription,
        price: req.body.price,
    }).then((response) => {
        req.flash("success", "Bicycle Successfully Listed");
        res.redirect("/bicycles");
    })
    .catch((error) => next (error))
});

router.get("/bicycles", (req, res, next) => {
    console.log(req.session);
    Bicycle.find()
    .then((allTheBicycles) => {
        res.render("bicycles/bicycle-list", {Bicycle: allTheBicycles})
    })
    .catch((error) => next(error));
})


module.exports= router