//importing packages 
const validator = require("validator");
const cryptoRandomString = require("crypto-random-string");
const useragent = require('useragent');
//importing models
let urls = require("../../models/urls");
let url_analytics = require("../../models/url_analytics");
const utils = require("./utils");

/******************************************** */
//This is the main url controller  which checks and matches urls
/******************************************** */

exports.shortenurl = async (req, res) => {
    let { code } = req.body;

    if (!code) {
        res.status(400).json({
            success: false,
            message: "Please pass the urlcode !",
            data: null
        })
    }

    //calling hash function to match db hash
    code = utils.hashstr(code);
    urls.findOne({ 
        url_hash: code,
        is_blocked:false,
        will_open_at:{
            $lte: new Date(), //checking link expiring time 
        },
        will_expire_at:{
            $gte:new Date()
        }
    }).then(urldata => {
        
        const agent = useragent.parse(req.headers['user-agent']);
        const ip = utils.encrypt(req.headers['x-forwarded-for'] || req.socket.remoteAddress);
        // console.log(agent.toAgent(),"os",agent.os.toString());

         const newurl_analytics = new url_analytics({
            link_id:urldata._id,
            user_ip:ip,
            user_browser:agent.toAgent(),
            user_os:agent.os.toString()
         })
         newurl_analytics
         .save()
         .then(data =>{
            //  console.log(data,88);
         })
         .catch(err =>{
             console.log(err);
         })
        //updating total clicks
        let query = {_id:urldata._id}
        urls.findOneAndUpdate(query, { $set: { total_clicks: urldata.total_clicks + 1 }}) //incrementing total clicks
        .then(() =>{


            return res.status(200).redirect(utils.decrypt(urldata.redirects_to));
        }).catch(err =>{
            console.log(err);
        })
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
            message: "Link shortened successfully",
            data: response
        })
    }).catch(err => {
        console.log(err);
    })


}

/******************************************** */
//This functions is mainly for giving the total clicks to ano user
/******************************************** */
exports.anototalclicks = async (req, res) => {
    let { id } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the link id !",
            data: null
        })
    }
    
    urls.findOne({ 
        _id: id
    }).then(urldata => {
        return res.status(200).json({
            success: true,
            message: "Successfully fetched total clicks",
            data: {
                total_clicks:urldata.total_clicks
            }
        })
    }).catch(err =>{
        return res.status(404).json({
            success: false,
            message: "Invalid url",
            data: null
        })
    })

}

/******************************************** */
//Custom url namechange for anonymous user
/******************************************** */

exports.url_namechange = async (req, res) => {
    let { id,code } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the link id !",
            data: null
        })
    }
    if (!code) {
        return res.status(400).json({
            success: false,
            message: "Please pass the link unique code !",
            data: null
        })
    }

    let newurlcode = encodeURIComponent(code) ;
    
    urls.findOne({ 
        url_hash:utils.hashstr(newurlcode),
        will_open_at:{
                $lte: new Date(), //checking link expiring time 
        },
        will_expire_at:{
                $gte:new Date()
        }
    }).then((data) => {
        
        if(data){
            return res.status(400).json({
                success: false,
                message: "Name not available !",
                data: null
            })
        }else{
            let query = {_id:id}
            
            const fullUrl = req.protocol + '://' + req.get('host');
            urls.findOneAndUpdate(query, { $set: { url_hash: utils.hashstr(newurlcode),url_encrypt:utils.encrypt(newurlcode) }}) //incrementing total clicks
            .then((data) =>{
                console.log(data,23)
                return res.status(200).json({
                    success: true,
                    message: "Successfully updated url name",
                    data: {
                        shortenedLink: `${fullUrl}/${newurlcode}`,
                    }
                })
            }).catch(err =>{
                return res.status(404).json({
                    success: false,
                    message: "Invalid id",
                    data: null
                })
            })
        }
    }).catch(err =>{
        return res.status(404).json({
            success: false,
            message: "Url with same name already available",
            data: err
        })
    })

}