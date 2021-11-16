require("dotenv").config({ path: "../../.env" });

const JWT = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const validator = require("validator");
const { OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
//importing models
const users = require ("../../models/user");



  

exports.googleTokenVerify = async (req, res, next) =>{
  const {token} = req.body;
  
const ticket = await client.verifyIdToken({
  idToken:token,
  audience:process.env.GOOGLE_CLIENT_ID
});
  const userProfiledata = ticket.getPayload();
  
     
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
        }},{upsert: true , new:true}).then(data =>{

          //check if user is blacklisted/blocked
         
          let payload = {
            user_id:data._id,
            firstName:data.firstName,
            lastName:data.lastName,
            profilePic:data.profilePic
          }
          
            if(data.is_user_blacklisted){
              const error = "User blocked,plese contact admin";
              return done(error,null);
            }else{
              const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.EXPIRESIN,
              });

              return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                  token:token
                }
              })
              
            }
          
          
        }).catch(err =>{
          return res.status(401).json({
            success: false,
            message: "Some error occured",
            data: ""
          })
        })
}