require("dotenv").config({ path: "../../.env" });
const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

//imporing controllers
const urls_controller = require("../controllers/urls/urls")

//anonymous user routes

router.post('/anonymous/shortner',urls_controller.create_ano_urls);

router.post('/anonymous/totalClicks',urls_controller.anototalclicks);

router.post('/anonymous/customizeurl',urls_controller.url_namechange);

router.post('/getredirecturl',urls_controller.shortenurl);
//protected routes
// router.post(
//     "/get_user_booking_data",
//     passport.authenticate("jwt", { session: false }),
//     get_user_booking_data
//   );


module.exports = router;
