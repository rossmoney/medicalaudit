var mongoose = require('mongoose'),
User = mongoose.model('User');

exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  User.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.findByName = function(req, res){
  var username = req.params.username;
  User.findOne({'username':username},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  User.create(req.body, function (err, musician) {
    if (err) return console.log(err);
    return res.send(musician);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  User.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d musicians', numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  User.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
  User.create(
    { "user": "Ross", "password": md5("test") }
  , function (err) {
    if (err) return console.log(err);
    return res.send(202);
  });
};

