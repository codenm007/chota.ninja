require("dotenv").config({ path: "../../.env" });
const express = require("express");
const router = express.Router();
const passport = require("passport");
require('../config/passport');
//imporing controllers
const Usercontroller = require("../controllers/users/user");

//importing important utils
const isLoggedIn = require("../controllers/users/utils").isLoggedIn;
const googleOauth = require("../controllers/users/utils").googleOauth;


//anonymous user routes

router.get('/success', (req, res) => res.send("gghghghgh"));
router.get('/error', (req, res) => res.send("error logging in"));


router.post('/auth/google', Usercontroller.googleTokenVerify);


router.get('/auth/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    req.user= null;
    res.send('Goodbye!');
});


router.get('/personal_info', (req, res) => {
  
  res.status(200)
  .json({
    data:req.user
  })
});

module.exports = router;
