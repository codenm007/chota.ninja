require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//importing models 
const users = require("../models/user");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8081/user/auth/google/callback",
    passReqToCallback:true
  },
  function(request,accessToken, refreshToken, profile, done) {

    //syncing the profile with the db 

     let userProfiledata = profile._json;
     
     let query = {email:userProfiledata.email}
       users.findOneAndUpdate(query, { $set: { 
          firstName: userProfiledata.given_name,
          lastName:userProfiledata.family_name,
          email:userProfiledata.email,
          profilePic:userProfiledata.picture,
          loginmethod:"google oauth",
          vendor_sub_id:userProfiledata.sub,
          is_email_verified:userProfiledata.email_verified,
          locale:userProfiledata.locale,
          last_login:new Date()
        }},{upsert: true}).then(data =>{

          //check if user is blacklisted/blocked
          if(data){
            if(data.is_user_blacklisted){
              const error = "User blocked,plese contact admin";
              return done(error,null);
            }else{
              return done(null, profile);
            }
          }else{
            return done(null, profile);
          }
          
        }).catch(err =>{
          console.log(err);
        })
  }
));

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});
