// All the routes are merged with the index routes

const express = require("express");
const router = express.Router();

//importing routes
const url_router = require("./urls")

//importing controllers

const {shortenurl} = require("../controllers/urls/urls");

//this is the main redirect router 
router.get("/:code", shortenurl);



module.exports = router;
