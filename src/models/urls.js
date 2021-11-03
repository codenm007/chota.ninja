const mongoose = require("mongoose");
const db_schema = require("../database/db");

const schema = new db_schema(
    {
        url_hash: {
          type: String,
          required:true,
          trim:true
        },
        url_encrypt: {
          type: String,
          required:true,
          trim:true
        },
        user_id: {
            type: String,
          },
        redirects_to: {
            type: String,
            required:true,
            trim:true
        },
        total_clicks: {
          type: Number,
          default:0,
          required:true
        },
        will_open_at: {
          type:Date,
          default: Date.now()
        },
        will_expire_at: {
            type:Date,
            default: () => new Date(+new Date() + 1*365*24*60*60*1000) //each link is valid for a year only
        },
        is_blocked:{
            type:Boolean,
            default:false
        },
        is_passworded:{
            type:Boolean,
            default:false
        },
        is_form_attached:{
            type:Boolean,
            default:false
        },
        is_email_notification_enabled:{
            type:Boolean,
            default:false
        }
      },
      {
        timestamps: true,
      }
);

const urls =  mongoose.model("urls", schema);

module.exports = urls;