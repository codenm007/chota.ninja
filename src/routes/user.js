require("dotenv").config({ path: "../../.env" });
const express = require("express");
const router = express.Router();
const passport = require("passport");
require('../config/passport');
//imporing controllers

//importing important utils
const isLoggedIn = require("../controllers/users/utils").isLoggedIn;


//anonymous user routes

router.get('/success', (req, res) => res.send("gghghghgh"));
router.get('/error', (req, res) => res.send("error logging in"));


//protected routes
// router.post(
//     "/get_user_booking_data",
//     passport.authenticate("jwt", { session: false }),
//     get_user_booking_data
//   );
router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/user/success');
  });

router.get('/auth/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    req.user= null;
    res.send('Goodbye!');
});


router.get('/personal_info',isLoggedIn, (req, res) => {
  
  res.status(200)
  .json({
    data:req.user
  })
});

module.exports = router;
