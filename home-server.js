var express = require("express");
var app = express();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hargun312kaur@gmail.com',
    pass: 'missgunu'
  }
});
var donorRouter=require("./donor-router");
var recipientRouter=require("./recipient-router");
var mysql = require("mysql");
var dbConfigObj = {
 host: "localhost",
 user: "root",
 password: "",
 database: "nodejs"
};
var dbcon = mysql.createConnection(dbConfigObj);
dbcon.connect(function (err) {
 if (err) {
  console.log(err.message);
 }
 else {
  console.log("Connected Successfully");
 }
});
app.use(express.static("public"));
app.post(express.urlencoded({extended:true}));
const port=process.env.PORT||5000;
app.listen(port, function () {
 console.log("Server Started");
});

app.get("/home", function (req, resp) {
 resp.sendFile(process.cwd() + "/public/index.html");
});
app.get("/ajax-check-user", function (req, resp) {
 //console.log(req.query.email);
 dbcon.query("select * from userss where email=?", [req.query.email], function (err, res) {
  console.log(res);
  resp.send(res);
 });
});
app.get("/ajax-signup-user", function (req, resp) {
 console.log(req.query);
 var data = [req.query.email, req.query.password, req.query.mobile, req.query.utype, req.query.dos];
 dbcon.query("insert into userss values(?,?,?,?,current_date)", data, function (err) {
  if (err) {
   console.log(err.message);
  }
  else {
   console.log("Data uploaded");
  }
 });
});
app.get("/ajax-login-user", function (req, resp) {
 //console.log(req.query);
 dbcon.query("select utype from userss where (email=? and password=?)", [req.query.email, req.query.password], function (err, res) {
  console.log(res);
  resp.send(res);
 });
});
app.get("/forgot",function(req,resp){
 dbcon.query("select * from userss where email=?",[req.query.email],function(err,res){
  console.log(res);
  var mailOptions = {
  from: 'hargun312kaur@gmail.com',
  to: req.query.email,
  subject: 'Password for Medissist',
  html: '<h4>Your password for the Medissist account is "'+res[0].password+'".</h4><br><p>Please click on the following link to <a href="index.html">Login</a>. </p>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  resp.send(res);
 });
});

app.use("/donor",donorRouter);
app.use("/recipient",recipientRouter);