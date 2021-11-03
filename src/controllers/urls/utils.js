require("dotenv").config();
const CryptoJS = require("crypto-js");
const base64 = require("crypto-js/enc-base64");

exports.encrypt = (text) =>{
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_SECRET_KEY).toString();
} 
exports.decrypt = (hash) =>{
    const bytes  = CryptoJS.AES.decrypt(hash, process.env.ENCRYPT_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);    
}

exports.hashstr = (str) => {
    return base64.stringify(CryptoJS.HmacMD5(str,process.env.HASH_SECRET_KEY));
}