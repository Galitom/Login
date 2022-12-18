const { request } = require("express");
var express = require("express");
var apiServer = express();
var fs = require("fs");
var cors = require("cors");
apiServer.use(cors());

//MYSLQ connecion
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '',
    user: '',
    password:'',
    database: ''
  });

var host="localhost";
var port= 3000;
apiServer.listen(port, host, ()=>{
    console.log("Server Partito: http://%s:%d/", host, port);
    connection.query(
        'Select * from User;',
        function(err, results) {
          console.log(results); 
        }
      );
});

//API used to get the login
apiServer.get("/api/login", (req, res)=>{
    console.log("ricevuti: ", req.query.mail, req.query.password);
    var mail = req.query.mail;
    var password = req.query.password;
    connection.query(
        'Select count(*) as Utenti from User where mail="'+mail+'" and password="'+password+'";',
        function(err, results) {
          console.log(results);
          if(results[0].Utenti===1){
            res.status(200).json({"message":"Login effettuata"});
          }else{
            console.log("error: "+err);
            res.sendStatus(400);
          }
        }
      );
});

//API used to get the sign up
apiServer.get("/api/register", (req, res)=>{
    var mail = req.query.mail;
    var password = req.query.password;
        console.log("ricevuti: ", mail, password);
        connection.query('insert into User values ("'+mail+'", "'+password+'"); ',function(err, results) {
        console.log(results);
        if (err) {
            console.log("error: "+err);
            res.sendStatus(400);
        }else{
            res.statusCode = 200;
            res.json({"message":"sign up effettuata"});
          }
        }
      );   
});

//API used to get the information from the table User with the mail as PK 
apiServer.get("/api/home", (req, res)=>{
        var mail = req.query.mail;
        console.log("ricevuti: ", mail);
        connection.query('Select * from Voti where mail="'+mail+'";',function(err, results) {
        console.log(results);
        if (err) {
            console.log("error: "+err);
            res.sendStatus(400);
        }else{
            res.statusCode = 200;
            res.send(results);
          }
        }
      );   
});

//API used to write in the user.json  
apiServer.get("/api/put", (req, res)=>{
  var mail = req.query.mail;
  var password = req.query.password;
  console.log("ricevuti: ", mail, password);
  fs.readFile("user.json", (err, data) => {
    if (err) {
        console.log("error: "+err);
    } else {
        var user = JSON.parse(data);
        user.push({"user":mail,"password":password});
        fs.writeFile("user.json", JSON.stringify(user), (err) => {
            if (err) {
                console.log("error: "+err);
                res.sendStatus(400);
            }else{
              console.log("success");
              res.statusCode = 200;
            }
        });
    }
  });
});