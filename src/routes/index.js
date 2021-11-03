// All the routes are merged with the index routes

const express = require("express");
const router = express.Router();

//importing routes
const url_router = require("./urls")

router.get("/", url_router);


module.exports = router;
