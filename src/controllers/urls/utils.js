require("dotenv").config();
const CryptoJS = require("crypto-js");

exports.encrypt = (text) =>{
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_SECRET_KEY).toString();
} 
exports.decrypt = (hash) =>{
    const bytes  = CryptoJS.AES.decrypt(hash, process.env.ENCRYPT_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);    
}


