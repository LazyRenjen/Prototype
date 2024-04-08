const mysql = require("mysql");
const db = mysql.createConnection({ 
  host: process.env.myhost, 
  user: process.env.myuser, 
  password: process.env.mypassword, 
  database: process.env.mydatabase });

  db.connect( (error)=> {
    if(error){
      console.log("Error connecting to MySQL server.");
    }else{
      console.log("Connected to MySQL Server!");
      //send respose to clint
    }
   });

  module.exports = db;