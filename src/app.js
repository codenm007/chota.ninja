require("dotenv").config();
const express = require("express");
const app = new express();
const parser = require("body-parser");
const cors = require('cors');
const helmet = require("helmet");
const compress = require('compression');
const noCache = require('nocache');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

app.use(helmet());
app.use(compress()); // Compress all routes
app.use(helmet.xssFilter());
app.use(noCache());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.EXPRESS_SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());




//cors allowed to all

app.use(cors());

//body parser configarations
app.use(
  parser.urlencoded({
    extended: false,
  })
);

app.use(parser.json());

// all frontend routes are listed here exclusively
app.use('/',express.static(path.join(__dirname, 'build')));

app.use('/login',express.static(path.join(__dirname, 'build')));

app.use('/calendar', express.static(path.join(__dirname, 'build')))


  //importing all backend routes
   const index_routes = require("./routes/index");

   app.use(index_routes);
  
  
  //invalid route settings
app.all("*", (req, res) => {
  res.status(200).json({
   resp_code : 204,
   resp_message : "Not a valid endpoint ! , Galat site visit hogaya ji XD"
   });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT , ()=>
console.log(`Server is listening on port ${PORT}`)
);
