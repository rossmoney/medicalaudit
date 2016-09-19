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
  gestationalageweeks: String,
  gestationalagedays: String,
  addedby: String,
  //19/09/2016
  name: String,
  hospitalnum: String,
  referralgrade: String,
  referralfrom: String,
  referralformpresent: String,
  referralreason: String,
  gestationatreferralweeks: Number,
  gestationatreferraldays: Number
});

mongoose.model('Patient', PatientSchema);
