var fs = require('fs');
var exec = require('child_process').exec;
var express = require('express');
var app = express();
var port = 5000;

app.use(express.static('public'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.post('/execute', function(req, res) {
    var code = JSON.parse(req.body.code);
    var lang = req.body.lang;

    fs.writeFileSync("code." + lang, code);

    execute("g++ code.cpp", function(result, error) {
        console.log("compiling");
        if (error == "") {
            execute("./a.out", function(output) {
                console.log("result:" + output);
                res.write(output);
                res.end();
            });
        } else {
            console.log(error);
            res.write(error);
            res.end();
        }

    });
});

app.listen(port, function() {
    console.log("server up!");
});

// to execute a shell command and retrieve results in callback
function execute(command, callback) {
    exec(command, function(error, stdout, stderr) { callback(stdout, stderr); });
};