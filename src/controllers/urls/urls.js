//importing packages 
const validator = require("validator");

//importing models
let urls = require("../../models/urls");
const utils = require("./utils");

/******************************************** */
//This is the main url controller  which checks and matches urls
/******************************************** */

exports.shortenurl = (req,res) =>{
    const {code} = req.params

    if(code == "1234"){
        res.redirect("https://google.co.in")
    }else{
        res.status(200).json({
            message:"404"
        });
    }

}
/******************************************** */
//This functions is mainly for creating unregistered users urls
/******************************************** */

exports.create_ano_urls = (req,res) => {
const {redirects_to,will_open_at,will_expire_at} = req.body;

if(!redirects_to){
    res.status(400).json({
        success:false,
        message:"Please pass the redirect url !",
        data:null
    })
}

if(!validator.isURL(redirects_to)){
    res.status(400).json({
        success:false,
        message:"Please pass valid redirect url !",
        data:null
    })
}

const new_short_url = new urls({

});


}