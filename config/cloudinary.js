const cloudinary= require ('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const express = require('express');
const multer= require('multer');

cloudinary.config({
        cloud_name: "jonscloud",
        api_key: "329736515669315",
        api_secret: "ye84lvel3kUKoDXMy6H9HyVbqU4"
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'project-2',
      format: async (req, file) => 'png'|| 'jpg' || 'jpeg', 
      public_id: (req, file) => file.originalname,
    },
  });
   
  const parser = multer({ storage: storage });

  module.exports= parser;