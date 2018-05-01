var server=require("../server.js")

function updateStore(res,query,update)
{
	var db=server.getDb()

	db.collection("vinylStore").update(query,update,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document updated!");

	});
	res.writeHead(200);
	res.end(JSON.stringify("Update is done!"))
}

function addItem(res,data)
{
	var db=server.getDb()

	var record={
                  vinylName:data.vinylName,
                  price:data.price,
                  imgName:data.imgName
                }

	db.collection("vinylStore").insertOne(record,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document inserted!");

	});
	res.writeHead(200);
	res.end(JSON.stringify("Insert is done!"))
}

function removeItem(res,query,update)
{
	var db=server.getDb()

	db.collection("vinylStore").update(query,update,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document updated!");

	});
	res.writeHead(200);
	res.end(JSON.stringify("Update is done!"))
}

module.exports.updateStore=updateStore