const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config({
  path: './.env'
});

const app = express();
const db = require('./database');

   //parse URL-encoded bodies 
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

// const publicDir = path.join(__dirname, "./folderforcss")
//app.use(express.static(publicDir));

app.set( "view engine", "hbs" ); //

//defineing  the routes
app.use( "/", require('./routes/pages'));
app.use('/auth', require('./routes/auth'))


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});


