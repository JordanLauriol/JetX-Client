var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let provider = fs.readFileSync(path.resolve('provider.json'));
provider = JSON.parse(provider);

app.post('/bet', function(req, res) {
    const amount = req.body.amount;
    const cashout = req.body.cashout;
    const position = req.body.position;

    let options = {
        "method": "POST",
        "hostname": provider.hostname,
        "port": provider.port,
        "path": provider.path + provider.token,
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];
        
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log("res", body.toString());
        });
    });

    req.write(qs.stringify({ Amount: amount.toString(), Autocashout: cashout.toString(), Position: position.toString() }));
    req.end();

    res.send('OK');
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);