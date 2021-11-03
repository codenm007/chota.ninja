require("dotenv").config({ path: "../../.env" });

const JWT = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const validator = require("validator");
//importing models
const User = require ("../models/user");
//importing models
const {
  resturant_tables_booking,
} = require("../models/resturants");

//for signup
const signup = async (req, res, next) => {
    
    //chcecking if the user exist
    
    User.forge({ email: req.body.email })
      .fetch()
      .then(() => {
        return res.status(400).json({
          resp_code: 400,
          resp_message: "User Already registered !",
        });
      })
      .catch((err) => {

        //console.log(5445)
        //if user is not found then we will start registration process
  
        //checking if the fields are none
        if (
          !req.body.email ||
          !req.body.password ||
          !req.body.first_name ||
          !req.body.last_name ||
          !req.body.country_id ||
          !req.body.city_id ||
          !req.body.state_id ||
          !req.body.gender_code
        ) {
          return res.status(200).json({
            resp_code: 400,
            resp_message: "Fields Empty!",
          });
        }
  
        //validating user inputs
        if (!validator.isEmail(req.body.email)) {
         // console.log(validator.isEmail(req.body.username));
          return res.status(200).json({
            resp_code: 400,
            resp_message: "Invalid email !",
          });
        }
        //console.log(validator.isEmail(req.body.first_name),"jjjhh");
  
        // starting user registration
        
            const new_User = new User({
              gender_code: req.body.gender_code,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              profile_pic: req.body.profile_pic,
              email: req.body.email,
              password: req.body.password,
              country_id: req.body.country_id,
              state_id: req.body.state_id,
              city_id: req.body.city_id,
              role_code: 3
            });
  
            new_User
              .save()
              .then(() => {
                 
                  return res.json({
                    resp_code: 200,
                    resp_message: "Registration Complete",
                  });
                
              })
              .catch((err) => {
                  console.log(err);
                return res.status(400).json({
                    resp_code: 400,
                    resp_message: err,
                  });
              });
         
      })
      .catch((err) => {
          console.log(err)
        return res.status(200).json({
          resp_code: 400,
          resp_message: `Error code :${err}`,
        });
      });
  };

//for login
const login = async (req, res, next) => {

    
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        resp_code: 400,
        resp_message: "Fields Empty !",
        data: "",
      });
    }
    User.forge({ email: req.body.email })
      .fetch()
      .then((result) => {
        result
          .authenticate(req.body.password)
          .then((user) => {
            //console.log(user);


                    //console.log(customToken,"hvhvggjj");
                    const payload = {
                      sub: `${user.id}`,
                      email: req.body.email
                    };
  
                    const token = JWT.sign(payload, process.env.SECRET_OR_KEY, {
                      expiresIn: process.env.expires_in,
                    });
  
                    return res.status(200).json({
                      resp_code: 200,
                      message:"Login successful",
                      data: token
                    });
                  })
  
          .catch(() => {
            return res.status(401).json({
              resp_code: 401,
              resp_message: "Invalid credentials !",
            });
          });
      })
      .catch(() => {
        return res.status(400).json({
          resp_code: 400,
          resp_message: "User not found !",
        });
      });
  };

  //user booking data
const get_user_booking_data = async (req, res, next) => {

  let jwtlength = req.get("Authorization").length;
  let decoded = jwt_decode(req.get("Authorization").slice(7, jwtlength));

  const {page_size,page} = req.body;


  resturant_tables_booking
  .where({ booked_by: decoded.sub })
  .orderBy("created_at", "desc")
  .fetchPage({
    pageSize: page_size, // Defaults to 10 if not specified
    page: page // Defaults to 1 if not specified
  }).then(data =>{
    return res.status(200).json({
      resp_code: 200,
      resp_message: "Details fetched successfully!",
      data: data,
    });
  }).catch(err =>{
    return res.status(200).json({
      resp_code: 200,
      resp_message: "Error",
      data: err,
    });
  })
  };
  

  module.exports = {
      login,
      signup,
      get_user_booking_data
  }