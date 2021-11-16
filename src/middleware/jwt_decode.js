const jwt_decode = require("jwt-decode");

const decodeJWT = async (req,res,next) =>{
    
 if(req.headers["authorization"]){
    const Token = req.headers["authorization"].slice(6,req.headers["authorization"].length);
    req.user = jwt_decode(Token);
    next();
 }else{
     return res.status(500).json({
         success:false,
         message:"Some error occured",
         data:""
     })
 }
}

module.exports = decodeJWT;