var app = require('express')();
var http = require('http').Server(app);
var winston = require('winston');
var bodyParser = require('body-parser');
winston.add(winston.transports.File, {
    filename: 'logs.log',
    handleExceptions: false
});
winston.level = 'debug';
var log = winston;
app.use(bodyParser.json());
app.post('/', function(req, res) {
	var result = [];
	for (var i = 0; i < req.body.length; i++) {
		var archived = {
			Original: req.body[i],
			Archived: "http://"
		};
		result.push(archived);
	};
	res.send(result);
});

http.listen(3000, function() {
	log.info('listening on *:3000');
});