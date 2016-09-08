var mongoose = require('mongoose'),
Patient = mongoose.model('Patient'),
Session = mongoose.model('Session');

exports.findAll = function(req, res){
	if(!req.headers.authorization) return res.send( '{ "err": "No Auth!", "array" : "true" }');
	var token = req.headers.authorization;
	console.log('Auth:' + token);
  Session.findById({_id: token}, function(err, result) {
	if (err) return res.send( '{ "err": "Invalid Auth!", "array" : "true" }');
	console.log('Authdata:' + token);
	console.log('Auth:' + result._id );
	console.log('expired:' + result.expired );
	if(result._id == token && result.expired == 'N') {
		console.log('suceeded' );
		Patient.find({},function(err, results) {
			return res.send(results);
		});
	} else {
		return res.send( '{ "err": "Auth Expired!", "array" : "true" }');
	}
  });
};
exports.findById = function(req, res){
	if(!req.headers.authorization) return res.send( '{ "err": "No authorization specified!" }');
	var token = req.headers.authorization;
  Session.findById({_id: token}, function(err, result) {
	if (err) return res.send( '{ "err": "Invalid Auth!" }');
	if(result._id == token && result.expired == 'N') {
		
  var id = req.params.id;
  Patient.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
	} else {
		return res.send( '{ "err": "Auth Expired!" }');
	}
  });
};
exports.add = function(req, res) {
	if(!req.headers.authorization) return res.send( '{ "err": "No authorization specified!" }');
  Patient.create(req.body, function (err, musician) {
    if (err) return console.log(err);
    return res.send(musician);
  });
}
exports.update = function(req, res) {
  if(!req.headers.authorization) return res.send( '{ "err": "No authorization specified!" }');

  var updates = req.body,
	  token = req.headers.authorization;
  
  Session.findById({_id: token}, function(err, result) {
	if (err) return res.send( '{ "err": "Invalid Auth!" }');
	if(result._id == token && result.expired == 'N') {
console.log(req.params);
console.log(req.body);
  Patient.update({"_id": req.params.id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated patient');
      res.send(202);
  });
  
	} else {
		return res.send( '{ "err": "Auth Expired!" }');
	}
  });
}
exports.delete = function(req, res){
	if(!req.headers.authorization) return res.send( '{ "err": "No authorization specified!" }');
  var id = req.params.id;
  var token = req.headers.authorization;
  Session.findById({_id: token}, function(err, result) {
	console.log(result);
	if (err) return res.send( '{ "err": "Invalid Auth!" }');
	if(result._id == token && result.expired == 'N') {
		
  Patient.remove({'_id':id},function(result) {
    return res.send(result);
  });
	} else {
		return res.send( '{ "err": "Auth Expired!" }');
	}
  });
};

