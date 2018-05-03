//registerVerify.js
var express = require('express');
var router = express.Router();

var appVars=require('../server.js')

router.post('/', function(req,res){

	var p=appVars.getPublicPath()
	var db=appVars.getDb()
	var query={vinylName:req.body.vinylName, price:parseInt(req.body.price), imgName:req.body.imgName}

	db.collection("vinylStore").insertOne(query ,function(err,results){
		if(err) throw err
			else{
				console.log("test")
			}

	})
	res.redirect("adminIndex.html");
})
module.exports = router;