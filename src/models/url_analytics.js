const mongoose = require("mongoose");
const db_schema = require("../database/db");

const schema = new db_schema(
    {
        link_id: {
          type: String,
          required:true
        },
        user_ip: {
          type: String,
          required:true
        },
        user_browser: {
            type: String,
            required:true
          },
        user_os: {
            type: String,
            required:true,
        }
      },
      {
        timestamps: true,
      }
);

const url_analytics =  mongoose.model("url_analytics", schema);

module.exports = url_analytics;