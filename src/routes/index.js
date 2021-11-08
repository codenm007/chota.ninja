// All the routes are merged with the index routes

const express = require("express");
const router = express.Router();
const path = require("path");

//importing routes
const url_router = require("./urls");
const user_router = require("./user");

//importing redirect controller
const {shortenurl} = require("../controllers/urls/urls");

//this is the main redirect router 
router.get("/:code", shortenurl);
  
router.use('/urls',url_router);

router.use('/user',user_router);


module.exports = router;
