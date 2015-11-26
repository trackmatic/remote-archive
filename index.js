var app = require('express')();
var http = require('http').Server(app);
var https = require('https');
var winston = require('winston');
var bodyParser = require('body-parser');
var fs = require('fs');
var when = require('when');
var uuid = require('node-uuid');



winston.add(winston.transports.File, {
    filename: 'logs.log',
    handleExceptions: false
});
winston.level = 'debug';

var log = winston;

app.use(bodyParser.json());

function downloadFile(source, fileName) {

    var file = fs.createWriteStream(fileName);

    var d = when.defer();

    https.get(source, function(resp) {
        resp.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            d.resolve();
        });
    });

    return d.promise;
}


app.post('/', function(req, res) {

    var result = [];

    var promises = [];

    for (var i = 0; i < req.body.length; i++) {

        var fileName = uuid.v4();

        console.log(fileName);

        promises.push(downloadFile(req.body[i], fileName));

        var archived = {
            Original: req.body[i],
            Archived: 'http://www.trackmatic.net/pbx/' + fileName
        };

        result.push(archived);

    };

    when.all(promises).then(function() {
        res.send(result);
    });

});

http.listen(3000, function() {
    log.info('listening on *:3000');
});
