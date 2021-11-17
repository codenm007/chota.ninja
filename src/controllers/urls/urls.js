//importing packages 
const validator = require("validator");
const cryptoRandomString = require("crypto-random-string");
const useragent = require('useragent');
//importing models
let urls = require("../../models/urls");
let url_analytics = require("../../models/url_analytics");
const utils = require("./utils");
const { parser } = require('html-metadata-parser');
const geoip = require('geoip-lite');

/******************************************** */
//This is the main url controller  which checks and matches urls
/******************************************** */

exports.shortenurl = async (req, res) => {
    let { code,password } = req.params;

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

        const forwardFor= req.headers['x-forwarded-for'];
        console.log(forwardFor,"ff")
        
        const ip = utils.encrypt(forwardFor[0] || req.socket.remoteAddress);
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

            if(urldata.is_passworded){
                let user_req_pass = utils.hashstr(password);
                let link_pass = urldata.password_digest;
                if(user_req_pass == link_pass){ //password matched
                    return res.status(200).redirect(utils.decrypt(urldata.redirects_to));
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "Wrong password",
                        data: null
                    })
                }
            }else{
                return res.status(200).redirect(utils.decrypt(urldata.redirects_to));
            }
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

    const user_id = null;
    const is_synced = false;

    //The difference between opening and closing should be maximum 1 year for any user

    if(req.user){
         user_id = req.user.user_id;
         is_synced = true;
         if((new Date(will_expire_at) - new Date(will_open_at)) > 3*365*24*60*60*1000){
            return res.status(400).json({
                success: false,
                message: "Maximum 3 year of link storage is allowed for non registered user current tier !",
                data: null
            })
        }
    }else{
        if((new Date(will_expire_at) - new Date(will_open_at)) > 1*365*24*60*60*1000){
            return res.status(400).json({
                success: false,
                message: "Maximum 1 year of link storage is allowed for non registered user current tier !",
                data: null
            })
        }
    }

    if (!redirects_to) {
        return res.status(400).json({
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
        will_expire_at: will_expire_at,
        user_id:user_id,
        is_synced:is_synced
    });

    let metadata = JSON.parse(JSON.stringify(await parser(redirects_to))).meta

    new_short_url.save().then(data => {
        const fullUrl = "https" + '://' + req.get('host');
        let response = {
            id:data._id,
            shortenedLink: `${fullUrl}/${randomUrllink}`,
            actualLink:redirects_to,
            total_clicks: data.total_clicks,
            meta:metadata,
            opensAt: data.will_open_at,
            expiresAt:data.will_expire_at,
            is_blocked:data.is_blocked,
            is_synced:data.is_synced,
            is_passworded:data.is_passworded,
            createdAt:data.createdAt
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

    let newurlcode = encodeURIComponent(code.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()) ;
    
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

/******************************************** */
//This function is used to sync the current user urls with his account 
/******************************************** */
exports.sync_user_urls = async (req, res) => {
    const { url_id } = req.body;
    const {user_id} = req.user;

    if (!url_id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the url id !",
            data: null
        })
    }

        let query = {_id:url_id,is_synced:false}
        urls.findOneAndUpdate(query, { $set: { user_id:user_id,is_synced:true  }})
        .then(()=>{
            
                return res.status(200).json({
                    success: true,
                    message: "Url syned successfully !",
                    data: null
                })
            
        })
        .catch(err =>{
            console.log(err);
        })
}

/******************************************** */
//This function is used to get all the links of the users
/******************************************** */
exports.myLinks = async (req, res) => {
    const {user_id} = req.user;

        let query = {user_id:user_id,is_synced:true}
        urls.find(query)
        .then(async(links)=>{

            if(links.length == 0){
                return res.status(200).json({
                    success: true,
                    message: "successfully fetched links",
                    data: ""
                })
            }

            const decryptedResponse = [];

            links.forEach(async link =>{

                let metadata = JSON.parse(JSON.stringify(await parser(utils.decrypt(link.redirects_to)))).meta;
                const fullUrl = "https" + '://' + req.get('host');
                decryptedResponse.push({
                    id:link._id,
                    shortenedLink:`${fullUrl}/${utils.decrypt(link.url_encrypt)}`,
                    actualLink:utils.decrypt(link.redirects_to),
                    total_clicks:link.total_clicks,
                    meta: metadata,
                    opensAt:new Date(link.will_open_at),
                    expiresAt:new Date(link.will_expire_at),
                    is_blocked:link.is_blocked,
                    is_synced:link.is_synced,
                    is_passworded:link.is_passworded,
                    createdAt:link.createdAt
                })

                
                if(links.length == decryptedResponse.length){
                    return res.status(200).json({
                        success: true,
                        message: "successfully fetched links",
                        data: decryptedResponse
                    })
                }
            })

            
        })
        .catch(err =>{
            console.log(err);
        })
}

/******************************************** */
//This function is used to create the passworded urls
/******************************************** */

exports.passworded_links = async (req, res) => {
    const { url_id,password } = req.body;
    const {user_id} = req.user;

    if (!url_id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the url id !",
            data: null
        })
    }

        let query = {_id:url_id,is_synced:true,user_id:user_id}
        urls.findOneAndUpdate(query, { $set: { password_digest:utils.hashstr(password),is_passworded:true  }})
        .then(()=>{
            
                return res.status(200).json({
                    success: true,
                    message: "Password added successfully to link !",
                    data: null
                })
            
        })
        .catch(err =>{
            return res.status(403).json({
                success: false,
                message: "Action not allowed",
                data: null
            })
        })
}

/******************************************** */
//This function is used to diable the passworded for urls
/******************************************** */

exports.disable_passworded = async (req, res) => {
    const { url_id } = req.body;
    const {user_id} = req.user;

    if (!url_id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the url id !",
            data: null
        })
    }

        let query = {_id:url_id,is_synced:true,user_id:user_id,is_passworded:true}
        urls.findOneAndUpdate(query, { $set: { password_digest:null,is_passworded:false  }})
        .then(()=>{
            
                return res.status(200).json({
                    success: true,
                    message: "Password disabled successfully!",
                    data: null
                })
            
        })
        .catch(err =>{
            return res.status(403).json({
                success: false,
                message: "Action not allowed",
                data: null
            })
        })
}

/******************************************** */
//This function is used to block the  urls
/******************************************** */

exports.block_url = async (req, res) => {
    const { url_id } = req.body;
    const {user_id} = req.user;

    if (!url_id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the url id !",
            data: null
        })
    }



        let query = {_id:url_id,is_synced:true,user_id:user_id,is_passworded:true}
        urls.findOne(query).then((data)=>{
            let linkblocked = !data.is_blocked;
            
                urls.findOneAndUpdate(query, { $set: {is_blocked:linkblocked,updatedAt:new Date() }})
                .then(()=>{
                    let message = "Link blocked successfully !"
                    if(!is_blocked){
                        message = "Link unblocked successfully !"
                    }
                        return res.status(200).json({
                            success: true,
                            message: message,
                            data: null
                        })
                    
                })
                .catch(err =>{
                    console.log(err);
                })
        }).catch(err =>{
            return res.status(403).json({
                success: false,
                message: "Action not allowed",
                data: null
            })
        })

}

/******************************************** */
//This function is used to get all the  urls analytics data
/******************************************** */

exports.url_analytics_data = async (req, res) => {
    let { id } = req.body;
    const {user_id} = req.user;
    console.log(23,user_id)
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please pass the link id !",
            data: null
        })
    }
    urls.findOne({
        _id: id,
        user_id:user_id
    }).then(link_id =>{
        url_analytics.find({ 
            link_id: link_id._id
        }).then(analytics_data=> {
            let response = [];
            if(analytics_data.length == 0){
                return res.status(200).json({
                    success: true,
                    message: "Successfully fetched link analytics",
                    data: []
                })
            }

            analytics_data.forEach(data_url =>{
                const ipData = geoip.lookup(utils.decrypt(data_url.user_ip));
                let Country = "NA";
                let City = "NA";
                let timezone = "NA"
                if(ipData){
                    Country = ipData.country;
                    City = ipData.city;
                    timezone = ipData.timezone;
                }
                response.push({
                    user_ip:utils.decrypt(data_url.user_ip),
                    user_browser:data_url.user_browser,
                    user_os:data_url.user_os,
                    createdAt:data_url.createdAt,
                    country:Country,
                    city:City,
                    timezone:timezone
                })
                
            })
            if(response.length == analytics_data.length){
                return res.status(200).json({
                    success: true,
                    message: "Successfully fetched link analytics",
                    data: response
                }) 
            }
            
        }).catch(err =>{
            return res.status(404).json({
                success: false,
                message: "Analytics data not found",
                data: null
            })
        })
    }).catch(err =>{
        return res.status(403).json({
            success: false,
            message: "Action not allowed",
            data: null
        })
    })
}