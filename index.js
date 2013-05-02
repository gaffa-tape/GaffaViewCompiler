#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    watchPath = './',
    outputPath = './';
    
program
  .version(packageJson.version)
  .option('-v, --verbose', 'Verbose output')
  .option('-w, --watch [path]', 'Watch Path [default ./]')
  .option('-o, --output [path]', 'Output Path [default ./]')
  .parse(process.argv);


 if(program.watch){
    watchPath = program.watch;
 }

 if(program.output){
    outputPath = program.output;
 }

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
        command = path.join(command, 'gvc.exe ') + file;
    } else {
        // TODO: add other OS calls
    }

    exec(command, function (error, stdout, stderr) {
        callback(error, stdout);
    });
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