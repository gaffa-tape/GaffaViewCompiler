#!/usr/bin/env node

var program = require('commander'),
    fs = require('graceful-fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    gvc = require('./gvc'),
    watchPath = path.join(process.cwd(), 'pages'),
    outputPath = path.join(process.cwd(), 'pages'),
    throttle = 300,
    throttleTimeout;

program._name = 'gvc';

program
    .version(packageJson.version)
    .option('-v, --verbose', 'Verbose output')
    .option('-w, --watch [path]', 'Watch Path [default' + watchPath + ']', watchPath)
    .option('-o, --output [path]', 'Output Path [default' + outputPath + ']', outputPath)
    .option('-T, --throttle [milliseconds]', 'Minimum time between processing (milliseconds) [default ' + throttle +']', Number, throttle)
    .parse(process.argv);


function log (message) {
    if (program.verbose) {
        console.log(message);
    }
}

function tryToProcess(filename){
    var now = new Date();

    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(function(){
            processFile(filename);
        }, program.throttle);
}


function processFile(filename) {
    log(filename + ' has changed. Recompiling...');
    try{
        gvc.parse(path.resolve(path.join(watchPath, filename)), outputPath, function (error, result) {
            if(error){
                return console.log(error.stack || error);
            }

            log(filename + ' -> ' + path.basename(filename, path.extname(filename)) + '.json');
        });
    } catch(exception) {
        console.log(exception.stack || exception);
    }
}


log('Watching ' + watchPath + ' for changes.');
fs.watch(watchPath, function (eventType, filename) {
    if (eventType !== 'change' || path.extname(filename).toLowerCase() !== '.js') {
        return;
    }

    tryToProcess(filename);
});