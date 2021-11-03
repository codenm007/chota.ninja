//importing packages 
const validator = require("validator");
const cryptoRandomString = require("crypto-random-string");
//importing models
let urls = require("../../models/urls");
const utils = require("./utils");

/******************************************** */
//This is the main url controller  which checks and matches urls
/******************************************** */

exports.shortenurl = async (req, res) => {
    let { code } = req.params
    //calling hash function to match db hash
    code = utils.hashstr(code);
    urls.findOne({ 
        url_hash: code,
        is_blocked:false
    }).then(urldata => {
        return res.status(200).redirect(utils.decrypt(urldata.redirects_to));
    }).catch(err =>{
        return res.status(404).json({
            success: false,
            message: "Invalid url",
            data: null
        })
    })

}
/******************************************** */
//This functions is mainly for creating unregistered users urls
/******************************************** */

exports.create_ano_urls = async (req, res) => {
    const { redirects_to, will_open_at, will_expire_at } = req.body;

    if (!redirects_to) {
        res.status(400).json({
            success: false,
            message: "Please pass the redirect url !",
            data: null
        })
    }

    if (!validator.isURL(redirects_to)) {
        res.status(400).json({
            success: false,
            message: "Please pass valid redirect url !",
            data: null
        })
    }

    const randomUrllink = cryptoRandomString({ length: 7 });

    const new_short_url = new urls({
        url_hash: utils.hashstr(randomUrllink),
        url_encrypt: utils.encrypt(randomUrllink),
        redirects_to: utils.encrypt(redirects_to),
        will_open_at: will_open_at,
        will_expire_at: will_expire_at
    });



    new_short_url.save().then(data => {
        const fullUrl = req.protocol + '://' + req.get('host');
        let response = {
            id:data._id,
            shortenedLink: `${fullUrl}/${randomUrllink}`,
            total_clicks: data.total_clicks,
            createdAt: data.createdAt
        }
        return res.status(200).json({
            success: true,
            message: "Please pass valid redirect url !",
            data: response
        })
    }).catch(err => {
        console.log(err);
    })


}