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
    console.log(req.body)
    Bicycle.create({
        
        seller: req.session.currentUser._id,
        img: req.file.path,
        title: req.body.bicycleTitle,
        year: req.body.bicycleYear,
        brand: req.body.bicycleBrand,
        model: req.body.bicycleModel,
        description: req.body.bicycleDescription,
        price: req.body.bicyclePrice,
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
    .populate('seller')
    .then((theBicycle) => {
        console.log(theBicycle);
        const isSeller = req.session.currentUser && String(theBicycle.seller) === req.session.currentUser._id;
        const isAdmin = req.session.currentUser && req.session.currentUser.isAdmin;

        res.render("bicycles/bicycle-details", {bicycle: theBicycle, seller: isSeller, isAdmin: isAdmin})
    })
    .catch((error) => next (error))
});
router.post("/bicycles/:id/delete", isLoggedIn, (req, res, next) => {
    Bicycle.findById(req.params.id)
    .then((theBicycle) => {
        const isSeller = String(theBicycle.seller) === req.session.currentUser._id;
        const isAdmin = req.session.currentUser && req.session.currentUser.Admin;

        if (!isSeller && !isAdmin) {
            req.flash("error", "You are not authorized to delete this bicycle listing");
                //dont 4get string interpolation requires " ` "
            return res.redirect(`/bicycles/${req.params.id}`);
        }
        Bicycle.findByIdAndRemove(req.params.id)
        .then(() => {
            req.flash("success", "Bicycle was successfully deleted");
            res.redirect("/bicycles");
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.get("/bicycles/:id/edit", isLoggedIn, (req, res, next) => {
    Bicycle.findById(req.params.id)
    .then((theBicycle) => {
        const isSeller = String(theBicycle.seller) === req.session.currentUser._id;
        const isAdmin = req.session.currentUser && req.session.currentUser.Admin;

        if(!isSeller && !isAdmin) {
            req.flash("error", "You are not allowed to edit this posting");
            return res.redirect(`/bicycles/${req.params.id}`);
        }
        res.render("bicycles/bicycle-edit", {theBicycle: theBicycle})
    })
    .catch((error) => next(error));
});


router.post("/bicycles/:id/update", isLoggedIn, uploader.single("img"), (req, res, next) => {
    const updatedBicycleData = {
        title: req.body.bicycleTitle,
        year: req.body.bicycleYear,
        brand: req.body.bicycleBrand,
        model: req.body.bicycleModel,
        description: req.body.bicycleDescription,
        price: req.body.bicyclePrice,
    };

    if (req.file) {
        updatedBicycleData.img = req.file.path;
    }

    Bicycle.findByIdAndUpdate(req.params.id, updatedBicycleData)
    .then((response) => {
        req.flash("success", "Bicycle Successfully Updated");
        res.redirect(`/bicycles/${req.params.id}`);
    })
    .catch((error) => next (error))
});


module.exports = router;