(function(){
    var fs = require('fs'),
        path = require('path'),
        gui = require('nw.gui'),
        args= gui.App.argv,
        crel = require('crel'),
        log = fs.createWriteStream(path.join(path.dirname(args[1]),'gvc.log'), {'flags': 'a'});

    function serialise(watchPath, outputPath){
        if(watchPath){
            fs.stat(watchPath, function(error, stats){
                if(error){
                    log.write(error.stack);
                    return;
                }

                if(stats.isDirectory()){
                    fs.readdir(watchPath, writeFiles);
                } else {
                    parseDefinition(watchPath, outputPath || path.dirname(watchPath), function(error) {
                        window.close();
                    });
                }
            });
        }
    }

    function writeFiles(error, files, watchPath, outputPath){
        
        if(error){
            log.write(error.stack);
            return;
        }
        
        for (var i = 0; i < files.length; i++) {
            if(path.extname(files[i]).toLowerCase() === '.js') {
                parseDefinition(path.join(watchPath, files[i]), outputPath || watchPath);
            }
        }
    }

    function parseDefinition(fileName, destination, callback){
        fs.readFile(fileName, function (error, data) {
            if(error){
                log.write(error.stack);
                return;
            }

            var viewData = '';

            try {
                viewData = JSON.stringify(eval(data.toString()));
                viewData = viewData.replace('{', 
                    '{"_" : "<script>window.location = window.location + \'?_bust=\' + +new Date();<\/script>", ');
            } catch (e) {
                log.write(e.stack);
            }

            fs.writeFile(path.join(destination, path.basename(fileName, path.extname(fileName)) + '.json'), 
                viewData, function (error) {
                    if(error){
                        log.write(error.stack);
                        return;
                    }

                    if(callback && typeof callback === 'function'){
                        callback();
                    }
            });
        });
    }

    window.onload = function () {

        log.write('\n\n#########  Run started: ' + new Date().toString() + '  #########\n');

        document.body.appendChild(crel('script', {'src' : args[0]}));

        serialise(args[1], args[2]);
    };

}());