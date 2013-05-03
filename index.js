#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    watchPath = './views',
    outputPath = './views',
    mainScriptFile = 'scripts/main.browser.js';
    
program
  .version(packageJson.version)
  .option('-v, --verbose', 'Verbose output')
  .option('-w, --watch [path]', 'Watch Path [default' + watchPath + ']')
  .option('-o, --output [path]', 'Output Path [default' + outputPath + ']')
  .option('-m, --mainScript [file]', 'Main Script File [default' + mainScriptFile + ']')
  .parse(process.argv);

function hasError(error){
    if(error){
        console.log(error.stack);
        return true;
    }
}

function log(message){
    if(program.verbose){
        console.log(message);
    }
}

function parseView(file, callback){
    var exec = require('child_process').exec,
        command = path.join(path.dirname(process.argv[1]), 'build', 'output');

    if(process.platform === 'win32') {
        command = path.join(command, 'gvc.exe ')  + path.join(process.cwd(), mainScriptFile) + ' ' + file;
    } else {
        // TODO: add other OS calls
    }

    exec(command, function (error, stdout, stderr) {
        callback(error, stdout);
    });
}


if(program.watch){
    watchPath = program.watch;
}

if(program.output){
    outputPath = program.output;
}

if(program.mainScript){
    mainScriptFile = program.mainScript;
}

log('Watching ' + watchPath + ' for changes.');
log('Output path is ' + outputPath);

fs.watch(watchPath, function(eventType, filename){
    if(eventType !== 'change' || path.extname(filename).toLowerCase() !== '.js'){
        return;
    }
        
    log('Processing: ' + filename);
    
    parseView(path.resolve(path.join(watchPath, filename)), function(error, result){
        if(!hasError(error)){
            log(result);
        }
    });
});