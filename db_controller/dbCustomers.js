var server=require("../server.js")
// const {ObjectId} = require('mongodb'); // or ObjectID 

function insertCustomer(res,data)
{
  var db=server.getDb()
  console.log(data)
//  var info=JSON.parse(data)
  info=data
     
      var record={email:info.email,
                  pwd:info.pwd}
      console.log(record)
  db.collection("customers").insertOne(record, function (err, result) {
    if(err)
       console.log(err)
    else
    {
    console.log("insert: "+result.insertedCount)
    res.writeHead(200);
    }
  })
 
}

function findCustomers(res,query)
{
 var db=server.getDb()
  db.collection("customers").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}

function test(res,data)
{
  var succeeded = false;
  var db=server.getDb()
  console.log(data)
//  var info=JSON.parse(data)
  info=data
     
      var record={email:info.email,
                  pwd:info.pwd}
      console.log(record)
      if(!(db.collection("customers").findOne(record) == null))
      {
        succeeded=true;
      }

  return succeeded;
}



module.exports.insertCustomer=insertCustomer
module.exports.findCustomers=findCustomers
module.exports.test=test