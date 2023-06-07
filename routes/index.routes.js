const router = require("express").Router();
const express = require("express");

router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
