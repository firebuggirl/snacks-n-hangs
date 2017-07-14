//find all slugs equal to 'work'

db.stores.find({$and: [{"slug":{ $ne: null}}, {"slug": {$eq: "work"}}]})

db.stores.find({tags: "Open Late"})

db.stores.find({"location.address": "Paris, France"})



db.stores.find({"location.address": {$eq: "Paris, France"}).sort({name: 1})


db.stores.find({}, {name:1}).sort({name:1});


db.stores.find({}, {name:1, "location.address":1}).sort({"location.address":1, "name":1});
db.stores.find({}, {name:1, "location.address":1, _id: 0}).sort({"location.address":1, "name":1});


//There is a 2dsphere index on all location coordinates
db.stores.find({}, {location: [ -79.86569700000001,  43.2649159 ]})


db.stores.explain(true).find({}, {location: [ -79.86569700000001,  43.2649159 ], name: 1})


db.stores.find().sort({name: 1})


//getting explainable output from 'explain'
exp = db.stores.explain("executionStats")

exp.find( { slug : "olive-oil" } )
