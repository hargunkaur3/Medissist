var express=require("express");
var app=express.Router();
app.use(express.static("public"));
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
var fileuploading= require("express-fileupload");
app.use(fileuploading());
app.post(express.urlencoded({extended:true}));

app.get("/fetchmed",function(req,resp){
  // console.log(req.query);
  var data= [req.query.city];
  dbcon.query("select distinct medname from mediciness where status=1 and city=?",data,function(err,res){
  resp.send(res);
 });
});
app.get("/findonor",function(req,resp){
  // console.log(req.query);
  var data= [req.query.city, req.query.medname];
  dbcon.query("select * from mediciness where status=1 and city=? and medname=?",data,function(err,res){
  resp.send(res);
 });
});
app.get("/donordetails",function(req,resp){
  // console.log(req.query);
  var data= [req.query.email];
  dbcon.query("select * from profiless where email=?",data,function(err,res){
  resp.send(res);
 });
});
app.post("/details", function (req, resp) {
  //console.log(req.body);
 var data = [req.body.email, req.body.name, req.body.address, req.body.city, req.body.acard];
 dbcon.query("insert into needy values(?,?,?,?,?)", data, function (err,res) {
  if (err) {
   console.log("*    "+err.message);
  }
  else {
   console.log("Data uploaded");
   resp.redirect("recipient-details.html");
  }
 });
});
app.post("/update-details",function(req,resp){
 var data = [req.body.name, req.body.address, req.body.city, req.body.acard, req.body.email];
 dbcon.query("update needy set name=?,	address=?,	city=?, acard=? where email=?",data,function(err,res){
  if(err){
   console.log(err.message);
  }
  else{
   console.log("Updated");
   //resp.send("<h3>"+req.body.name+"'s Profile is updated</h3>");
   resp.redirect("recipient-details.html");
  }
 });
});
app.get("/check-reci",function(req,resp){
  //console.log(req.query.email);
  dbcon.query("select * from needy where email=?",[req.query.email],function(err,res){
    console.log(res);
    resp.send(res);
  });
});
app.get("/fetch",function(req,resp){
 dbcon.query("select distinct city from mediciness where status=1",function(err,res){
  resp.send(res);
 });
});
app.get("/getname",function(req,resp){
 //console.log(req.query.rid);
 dbcon.query("select name from needy where email=?",[req.query.email],function(err,res){
  if(err){
   console.log(err.message);
  }
  else{
   console.log(res);
   resp.send(res);
  }
 });
});

module.exports=app;