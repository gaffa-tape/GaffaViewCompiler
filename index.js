#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    path = require('path');

var packageJson = require('./package.json'),
    gvc = require('./gvc'),
    watchPath = path.join(process.cwd(), 'pages'),
    outputPath = path.join(process.cwd(), 'pages'),
    mainScriptFile = 'scripts/main.browser.js';
    
program
  .version(packageJson.version)
  .option('-v, --verbose', 'Verbose output')
  .option('-w, --watch [path]', 'Watch Path [default' + watchPath + ']', watchPath)
  .option('-o, --output [path]', 'Output Path [default' + outputPath + ']', outputPath)
  .option('-m, --mainScript [file]', 'Main Script File [default' + mainScriptFile + ']', mainScriptFile)
  .parse(process.argv);


function hasError (error) {
    if (error) {
        console.log(error.stack);
        return true;
    }
}

function log (message) {
    if (program.verbose) {
        console.log(message);
    }
}


log('Watching ' + watchPath + ' for changes. Output path is ' + outputPath);

fs.watch(watchPath, function (eventType, filename) {
    if (eventType !== 'change' || path.extname(filename).toLowerCase() !== '.js') {
        return;
    }
    
    log(filename + ' has changed.');
    
    gvc(path.resolve(path.join(watchPath, filename)), outputPath, function (error, result) {
        if ( ! hasError(error)) {
            log('Done');
        }
    });
});