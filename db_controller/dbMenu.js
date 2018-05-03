var server=require("../server.js")

function updateStore(res,query,update)
{
	var db=server.getDb()

	db.collection("store").update(query,update,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document updated!");

	});
	res.writeHead(200);
	res.end(JSON.stringify("Update is done!"))
}

module.exports.updateStore=updateStore