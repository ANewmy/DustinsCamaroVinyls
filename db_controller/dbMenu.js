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
	info=data

	var record={
                  vinylName:info.vinylName,
                  price:info.price,
                  imgName:info.imgName
                }

	db.collection("vinylStore").insertOne(record,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document inserted!");

	});
	res.end(JSON.stringify("Insert is done!"))
}

function removeItem(res,query,update)
{
	var db=server.getDb()

	db.collection("vinylStore").deleteOne(query,update,function(err,results) {
	if(err) throw err;
	console.log(results.result.n + "document deleted!");

	});
	res.end(JSON.stringify("Delete is done!"))
}

module.exports.updateStore=updateStore
module.exports.addItem=addItem
module.exports.removeItem=removeItem