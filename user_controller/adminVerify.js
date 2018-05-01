//userVerfiy.js
var express = require('express');
var router = express.Router();

var appVars=require('../server.js')

router.post('/', function(req,res){
	console.log(req.body.user)
	console.log(req.body.pwd)

	var p=appVars.getPublicPath()
	var db=appVars.getDb()
	var query={user:req.body.user,pwd:req.body.pwd}

	db.collection("admin").find(query).toArray(function(err,results){
		if(err) throw err
			else
				if(results.length>0)
				{
					console.log("Login in with :"+req.body.user)
					req.session.regenerate(function(){
						req.session.user=req.body.user
						res.sendFile(`${p}/adminIndex.html`) //is tick
					})
				}
				else
				{
					console.log("Invalid!")
					res.sendFile(`${p}/adminLogin.html`)
				}
	})

})
module.exports = router;