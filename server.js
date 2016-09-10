var express = require('express'),
cors = require('cors'),
bodyParser = require("body-parser"),
mongoose = require('mongoose'),
fs = require('fs');

var mongoUri = process.env.MONGOLAB_URI;
//var mongoUri = 'mongodb://localhost/patients';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
app.use(cors());

require('./app/models/patient');
require('./app/models/user');
require('./app/models/session');
require('./app/routes')(app);

app.listen(process.env.PORT || 8000);
console.log('Listening on port 8000...');