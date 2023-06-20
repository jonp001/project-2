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
        price: req.body.accessoryPrice,
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


router.post("/accessories/:id/favorited", isLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $addToSet: {favoriteAccessory: req.params.id}},
        {new: true}
    )
    .populate("favoriteAccessory")
    .then(user => {
        req.flash("success", "Accessory added to favorites list");
        res.redirect("/accessories");
    })
    .catch((error) => next(error));
});

router.get("/accessories/favorited", isLoggedIn, ( req, res, next) => {
    User.findById(req.session.currentUser._id)
    .populate("favoriteAccessory")
    .then(user => {
        res.render("accessories/accessory-list", {accessories: user.favoriteAccessory})
    })
    .catch((error) => next(error));
});

router.post("/accessories/:id/unfavorite", isLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(
        req.session.currentUser._id,
        {$pull: {favoriteAccessory: req.params.id}},
        {new: true}
)
.populate("favoriteAccessory")
.then(user => {
    req.flash("success", "Accessory removed from favorites list" );
    res.redirect("/accessories");
})
.catch(error => next(error));
});

router.get("/accessories/:id", (req, res, next) => {
    const theID= req.params.id;
    Accessory.findById(theID)
    .populate('seller')
    .then((theAccessory) => {
        const isSeller= req.session.currentUser && String(theAccessory.seller) === req.session.currentUser._id;
        const isAdmin= req.session.currentUser && req.session.currentUser.isAdmin;

        res.render("accessories/accessory-details", {accessory: theAccessory, seller: isSeller, isAdmin: isAdmin})
    })
    .catch((error) => next(error))
});

router.post("/accessories/:id/delete", isLoggedIn, (req, res, next) => {
    Accessory.findById(req.params.id)
    .then((theAccessory) => {
        const isSeller= String(theAccessory.seller) === req.session.currentUser._id;
        const isAdmin= req.session.currentUser && req.session.currentUser.Admin;

        if(!isSeller && !isAdmin) {
            req.flash("error", "You are not authorized to delete this accessory listing");
            return res.redirect(`/accessories/${req.params.id}`);
        }
        Accessory.findByIdAndRemove(req.params.id)
        .then(() => {
            req.flash("success", "Accessory was successfully deleted");
            res.redirect("/accessories");
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});   

router.get("/accessories/:id/edit", isLoggedIn, (req, res, next) => {
    Accessory.findById(req.params.id)
    .then((theAccessory) => {
        const isSeller= String(theAccessory.seller) === req.session.currentUser._id;
        const isAdmin= req.session.currentUser && req.session.currentUser.Admin;

        if(!isSeller && !isAdmin) {
            req.flash("error", " You are not authorixzed to edit this listing");
            return res.redirect(`/accessories/${req.params.id}`);
        }
        res.render("accessories/accessory-edit", {theAccessory: theAccessory})
    })
    .catch((error) => next(error));
});

router.post("/accessories/:id/update", isLoggedIn, uploader.single("img"), (req, res, next) => {
    const updatedAccessoryData= {
        title: req.body.accessoryTitle,
        description: req.body.accessoryDescription,
        price: req.body.accessoryPrice,
    };

    if(req.file) {
        updatedAccessoryData.img= req.file.path;
    }

    Accessory.findByIdAndUpdate(req.params.id, updatedAccessoryData)
    .then((response) => {
        req.flash("success", "Accessory Successfully Updated");
        res.redirect(`/accessories/${req.params.id}`);
    })
    .catch((error) => next(error));
});


module.exports= router