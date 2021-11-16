require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
  
  
  exports.isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
  }

  
    exports.googleOauth = async(req, res) => {
      console.log(6556)
      if (!req.user) {
        return res.status(400).send('Authentication failed!');
      }
      console.log(req.user,99899797);
      const { email } = req.user;
      const user = await User.findOne({ where: { email } });
      const token = jwt.sign({ id, email }, process.env.JWT_SECRET);
      return res.status(200).send({ token, user });
    }
 
