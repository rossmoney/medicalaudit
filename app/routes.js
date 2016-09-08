module.exports = function(app){
    var patients = require('./services/patient.service.js');
    app.get('/patients', patients.findAll);
    app.get('/patients/:id', patients.findById);
    app.post('/patients', patients.add);
	app.put('/patients/:id', patients.update);
    app.post('/patients/:id', patients.update);
    app.delete('/patients/:id', patients.delete);
	
	var users = require('./services/user.service.js');
    app.get('/users', users.findAll);
    app.get('/users/:id', users.findById);
    app.post('/users', users.add);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);
	app.get('/users/import', users.import);
	
	var sessions = require('./services/session.service.js');
    app.get('/sessions', sessions.findAll);
    app.get('/sessions/:id', sessions.findById);
    app.post('/sessions', sessions.add);
    app.put('/sessions/:id', sessions.update);
    app.delete('/sessions/:id', sessions.delete);
}