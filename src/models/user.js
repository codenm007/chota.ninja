const mongoose = require("mongoose");
const db_schema = require("../database/db");

const schema = new db_schema(
    {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        email: {
            type: String,
            unique: true 
          },
        profilePic: {
            type: String,
          },
        locale: {
            type: String,
          },
        loginmethod: {
            type: String,
            required:true,
        },
        vendor_sub_id: {
            type: String,
            required:true
        },
        is_email_verified:{
            type:Boolean,
            required:true
        },
        is_user_blacklisted:{
          type:Boolean,
          default:false
        },
        last_login: {
            type:Date
        }
      },
      {
        timestamps: true,
      }
);

const users =  mongoose.model("users", schema);

module.exports = users;