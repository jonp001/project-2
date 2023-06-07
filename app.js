const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session= require("express-session");
const MongoStore = require("connect-mongo")
const path= require("path");


// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs

const hbs = require('hbs');

const app = express();

//set view engine to hbs
app.set('view engine', 'hbs');

//set the path to the views folder
app.set('views', path.join(__dirname, "views"));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// local title default value
const projectName= 'bicycle-marketplace'
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title= `${capitalized(projectName)} created with IronLauncher`;



app.set('trust proxy', 1);
  app.use(
    session({
      secret: "canBeAnything",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: 'mongodb://0.0.0.0:27017/bicycle-marketplace'
 
        // ttl => time to live
        // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );

app.use((req, res, next) => {
  res.locals.user = req.session.currentUser || null;

  let isAdmin= false;
  if(req.session.currentUser && req.session.currentUser.Admin) isAdmin=true;
  res.locals.isAdmin= isAdmin;
  next();
  })


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const userRoutes= require("./routes/User.routes")
app.use("/", userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
