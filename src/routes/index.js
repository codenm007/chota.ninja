// All the routes are merged with the index routes

const express = require("express");
const router = express.Router();

//importing routes
const url_router = require("./urls")

//this is the main redirect router 
router.use('/urls',url_router)


module.exports = router;
