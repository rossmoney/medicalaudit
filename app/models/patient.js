var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PatientSchema = new Schema({
  anonid: String,
  refrecieved: Date,
  scanundertaken: Date,
  numdaystaken: Number,
  withinnationaltarget: String,
  reasonfordelay: String,
  abnormaloutcome: String,
  chdtype: String,
  whereseen: String,
  dateseen: Date
});

mongoose.model('Patient', PatientSchema);
