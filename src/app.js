const express = require("express");
const app = new express();
const parser = require("body-parser");
const cors = require('cors');
const helmet = require("helmet");
const compress = require('compression');
const noCache = require('nocache');

app.use(helmet());
app.use(compress()); // Compress all routes
app.use(helmet.xssFilter());
app.use(noCache());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());


//cors allowed to all

app.use(cors());
//body parser configarations
app.use(
  parser.urlencoded({
    extended: false,
  })
);

app.use(parser.json());


  //importing routes
   const index_routes = require("./routes/index");

   app.use('/',index_routes);
  
  
  //invalid route settings
app.all("*", (req, res) => {
  res.status(200).json({
   resp_code : 204,
   resp_message : "Not a valid endpoint ! , Galat site visit hogaya ji XD"
   });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT , ()=>
console.log(`Server is listening on port ${PORT}`)
);
