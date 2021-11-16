require("dotenv").config();
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// //importing models 
// const users = require("../models/user");


// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile,9090)
//     //syncing the profile with the db 

//      let userProfiledata = profile._json;
     
//      let query = {email:userProfiledata.email}
//        users.findOneAndUpdate(query, { $set: { 
//           firstName: userProfiledata.given_name,
//           lastName:userProfiledata.family_name,
//           email:userProfiledata.email,
//           profilePic:userProfiledata.picture,
//           loginmethod:"google oauth",
//           vendor_sub_id:userProfiledata.sub,
//           is_email_verified:userProfiledata.email_verified,
//           locale:userProfiledata.locale,
//           last_login:new Date()
//         }},{upsert: true , new:true}).then(data =>{

//           //check if user is blacklisted/blocked
         
//           let response = {
//             user_id:data._id,
//             firstName:data.firstName,
//             lastName:data.lastName,
//             profilePic:data.profilePic
//           }
//           if(data){
//             if(data.is_user_blacklisted){
//               const error = "User blocked,plese contact admin";
//               return done(error,null);
//             }else{
              
//               return done(null, response);
//             }
//           }else{
//             return done(null, response);
//           }
          
//         }).catch(err =>{
//           console.log(err);
//         })
//   }
// ));

// //users.findByIdAndDelete("61854c89709518ae10607427").then(data => console.log(data,1233))

// passport.serializeUser(function(user, done) {
//     /*
//     From the user take just the id (to minimize the cookie size) and just pass the id of the user
//     to the done callback
//     PS: You dont have to do it like this its just usually done like this
//     */
//     done(null, user);
//   });
  
// passport.deserializeUser(function(user, done) {
//     /*
//     Instead of user this function usually recives the id 
//     then you use the id to select the user from the db and pass the user obj to the done callback
//     PS: You can later access this data in any routes in: req.user
//     */
//     users.findById(user.user_id)
//     .then(()=>{
//       done(null,user);
//     })
//     .catch(()=>{
//       done(null, null);
//     })
   
// });

const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

//importing user model
const User = require("../models/user");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  const strategy = new JwtStrategy(opts, (payload, next) => {
    //getting user id from db
    //console.log(payload);
    next(null, payload);
  });
  
  passport.use(strategy);
  
  module.exports = passport;

