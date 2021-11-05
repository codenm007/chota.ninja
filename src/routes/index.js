// All the routes are merged with the index routes

const express = require("express");
const router = express.Router();

//importing routes
const url_router = require("./urls");
const user_router = require("./user");

//this is the main redirect router 
router.use('/urls',url_router);
router.use('/user',user_router);


module.exports = router;
