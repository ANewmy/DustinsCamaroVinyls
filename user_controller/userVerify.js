//userVerfiy.js
var express = require('express');
var router = express.Router();

var appVars=require('../server.js')

router.post('/', function(req,res){
	console.log(req.body.email)
	console.log(req.body.pwd)

	var p=appVars.getPublicPath()
	var db=appVars.getDb()
	var query={email:req.body.email,pwd:req.body.pwd}

	db.collection("customers").find(query).toArray(function(err,results){
		if(err) throw err
			else
				if(results.length>0)
				{
					console.log("Login in with :"+req.body.email)
					req.session.regenerate(function(){
						req.session.email=req.body.email
						res.sendFile(`${p}/index.html`) //is tick
					})
				}
				else
				{
					console.log("Invalid!")
					res.sendFile(`${p}/login.html`) //is tick
				}
	})

})
module.exports = router;