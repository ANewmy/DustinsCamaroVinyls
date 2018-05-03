//registerVerify.js
var express = require('express');
var router = express.Router();

var appVars=require('../server.js')

router.post('/', function(req,res){
	console.log(req.body.email)
	console.log(req.body.pwd)

	var p=appVars.getPublicPath()
	var db=appVars.getDb()
	var query={email:req.body.email, pwd:req.body.pwd}
	var email = {email:req.body.email}

	db.collection("customers").find(email).toArray(function(err,results){
		if(err) throw err
			else
				if(results.length>0)
				{
					console.log("Invalid register attempt, user already exists!")
					req.session.regenerate(function(){
					res.sendFile(`${p}/register.html`) //is tick
					})
				}
				else
				{
					console.log("Login in with :"+req.body.email)
					req.session.email=req.body.email
					var hasDigit = false;
					var hasLetter = false;
					for(var i = 0; i < req.body.pwd.length; i++){
						if (req.body.pwd.charAt(i) == 0 || req.body.pwd.charAt(i) == 1 ||
							req.body.pwd.charAt(i) == 2 || req.body.pwd.charAt(i) == 3 ||
							req.body.pwd.charAt(i) == 4 || req.body.pwd.charAt(i) == 5 ||
							req.body.pwd.charAt(i) == 6 || req.body.pwd.charAt(i) == 7 ||
							req.body.pwd.charAt(i) == 8 || req.body.pwd.charAt(i) == 9) {
    						hasDigit = true;
						}
						var temp = req.body.pwd.charAt(i).toUpperCase();
						if(req.body.pwd.charAt(i).toLowerCase() != temp){
							hasLetter = true;
							console.log("has a letter")
						}
					}
					if(hasDigit && hasLetter && req.body.pwd.length > 5){
						db.collection("customers").insertOne(query, function (err, result) {
    						if(err)
       							console.log(err)
    						else {
    							console.log("insert: "+result.insertedCount)
    						}
  						})
						res.sendFile(`${p}/home.html`) //is tick
					}
					else{
						console.log("invalid password")

						res.sendFile(`${p}/register.html`)
					}
				}
	})
})
module.exports = router;