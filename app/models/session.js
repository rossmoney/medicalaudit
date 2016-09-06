var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var SessionSchema = new Schema({
  username: String,
  logindate: Date,
  expired: String
});

mongoose.model('Session', SessionSchema);
