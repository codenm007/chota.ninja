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