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
        res.render("bicycles/bicycle-list", {bicycles: allTheBicycles})
    })
    .catch((error) => next(error));
});

router.post("/bicycles/:id/favorited", isLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $addToSet: { favoriteBicycle: req.params.id} },
        { new: true }
    )
    .populate("favoriteBicycle")
    .then(user => {
        req.flash("success", "Bicycle added to favorites list");
        res.redirect("/bicycles");
     })
     .catch((error) => next(error));
});

router.get("/bicycles/favorited", isLoggedIn, (req, res, next) => {
    User.findById(req.session.currentUser._id)
    .populate("favoriteBicycle")
    .then(user => {
        res.render("bicycles/bicycle-list", {bicycles: user.favoriteBicycle})
    })
    .catch(error => next(error));
});

router.post("/bicycles/:id/unfavorite", isLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(
        req.session.currentUser._id,
        {$pull : {favoriteBicycle: req.params.id} },
        {new: true}
    )
    .populate("favoriteBicycle")
    .then(user => {
        req.flash("success", "Bicycle removed from favorites list");
        res.redirect("/bicycles");
    })
    .catch(error => next(error));
});

router.get("/bicycles/:id", (req, res, next) => {
    const theID= req.params.id;
    Bicycle.findById(theID)
    .then((theBicycle) => {
        res.render("bicycles/bicycle-details", {bicycle: theBicycle})
    })
    .catch((error) => next (error))
});

module.exports = router;