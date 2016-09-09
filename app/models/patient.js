var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PatientSchema = new Schema({
  anonid: String,
  refrecieved: Date,
  scanundertaken: Date,
  reasonfordelay: String,
  abnormaloutcome: String,
  chdtype: String,
  whereseen: String,
  gestationalage: String,
  addedby: String
});

mongoose.model('Patient', PatientSchema);
