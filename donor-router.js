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

app.post("/profile", function (req, resp) {
 if(req.files==null){
  req.body.picname="nopic";
 }
 else{
  req.body.picname=req.files.ppic.name;
  console.log(req.body);
  console.log(process.cwd());
  var uploadingPath=process.cwd()+"/public"+"/uploads/"+req.files.ppic.name;
  req.files.ppic.mv(uploadingPath,function(err){
  if(err){
   console.log(err);
  }
  else{
   console.log("Object uploaded");
  }
 });
 req.body.picname=req.files.ppic.name;
 var data = [req.body.email, req.body.name, req.body.contact, req.body.address, req.body.city, req.body.acard, req.body.picname];
 dbcon.query("insert into profiless values(?,?,?,?,?,?,?)", data, function (err) {
  if (err) {
   console.log("*    "+err.message);
  }
  else {
   console.log("Data uploaded");
   resp.redirect("donor-profile.html");
  }
 });
 }
});
app.post("/update-profile",function(req,resp){
  // console.log("hi");
  // console.log(req.files);
 if(req.files==null){
  req.body.picname=req.body.picture;
 }
 else{
  req.body.picname=req.files.ppic.name;
  console.log(req.body);
  console.log(process.cwd());
  var uploadingPath=process.cwd()+"/public"+"/uploads/"+req.files.ppic.name;
  req.files.ppic.mv(uploadingPath,function(err){
  if(err){
   console.log(err);
  }
  else{
   console.log("Object uploaded");
  }
 });
 req.body.picname=req.files.ppic.name;}
 var data = [req.body.name, req.body.contact, req.body.address, req.body.city, req.body.acard, req.body.picname, req.body.email];
 dbcon.query("update profiless set name=?,	contact=?,	address=?,	city=?, acard=?, picname=? where email=?",data,function(err){
  if(err){
   console.log(err.message);
  }
  else{
   console.log("Updated");
   resp.redirect("donor-profile.html");
  }
 });
 
});
app.post("/med-save", function (req, resp) {
 if(req.files==null){
  req.body.picname="nopic";
 }
 else{
  req.body.picname=req.files.pic.name;
  console.log(req.body);
  console.log(process.cwd());
  var uploadingPath=process.cwd()+"/public"+"/uploads/"+req.files.pic.name;
  req.files.pic.mv(uploadingPath,function(err){
  if(err){
   console.log(err);
  }
  else{
   console.log("Object uploaded");
  }
 });
 var data = [req.body.email, req.body.city, req.body.medname, req.body.company, req.body.expdate, req.body.unit, req.body.qty, req.body.picname, req.body.doa, req.body.status];
 dbcon.query("insert into mediciness values(null,?,?,?,?,?,?,?,?,current_date,1)", data, function (err) {
  if (err) {
   console.log("*    "+err.message);
  }
  else {
   console.log("Data uploaded");
   resp.redirect("med-avail.html");
  }
 });
 }
});
app.post("/med-update",function(req,resp){
 if(req.files==null){
  //req.body.picname="nopic";
  req.body.picname=req.body.picture;
 }
 else{
  req.body.picname=req.files.pic.name;
  var uploadingPath=process.cwd()+"/public"+"/uploads/"+req.files.pic.name;
  req.files.pic.mv(uploadingPath,function(err){
  if(err){
   console.log(err);
  }
  else{
   console.log("Object uploaded");
  }
 });}
 var data = [req.body.city, req.body.company, req.body.expdate, req.body.unit, req.body.qty, req.body.picname, req.body.rid];
 dbcon.query("update mediciness set city=?,	company=?,	expdate=?,	unit=?, qty=?, picname=? where rid=?",data,function(err){
  if(err){
   console.log(err.message);
  }
  else{
   console.log("Updated");
   resp.redirect("med-avail.html");
  }
 });
});
app.get("/fetchmedicines",function(req,resp){
 dbcon.query("select * from mediciness where status=1 and email=?",[req.query.email],function(err,res){
  resp.send(res);
 });
});
app.get("/delmedicine",function(req,resp){
 //console.log(req.query.rid);
 dbcon.query("update mediciness set status=0 where rid=?",[req.query.rid],function(err,res){
  if(err){
   console.log(err.message);
  }
  else{
   resp.send();
  }
 });
});
app.get("/getname",function(req,resp){
 //console.log(req.query.rid);
 dbcon.query("select name from profiless where email=?",[req.query.email],function(err,res){
  if(err){
   console.log(err.message);
  }
  else{
   //console.log(res);
   resp.send(res);
  }
 });
});
app.post("/check-donor",function(req,resp){
  //console.log(req.query.email);
  dbcon.query("select * from profiless where email=?",[req.query.email],function(err,res){
    //console.log(res);
    resp.send(res);
  });
});
app.get("/getmed",function(req,resp){
  //console.log(req.query.email);
  dbcon.query("select * from mediciness where rid=?",[req.query.rid],function(err,res){
    //console.log(res);
    resp.send(res);
  });
});

module.exports=app;