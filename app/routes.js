module.exports = function(app){
    var patients = require('./services/patient.service.js');
    app.get('/patients', patients.findAll);
    app.get('/patients/:id', patients.findById);
    app.post('/patients', patients.add);
    app.put('/patients/:id', patients.update);
    app.delete('/patients/:id', patients.delete);
	app.get('/patients/import', patients.import);
	
	var users = require('./services/user.service.js');
    app.get('/users', users.findAll);
    app.get('/users/:id', users.findById);
	app.get('/users/:username', users.findByName);
    app.post('/users', users.add);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);
	app.get('/users/import', users.import);
}