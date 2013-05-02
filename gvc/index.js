(function(){

    var fs = require('fs'),
        path = require('path'),
        gui = require('nw.gui'),
        args= gui.App.argv,
        Gaffa = require('gaffa'),
        gaffa = new Gaffa(),
        loaded = 0;

    function loadDem(files, objectType, callback){
        var error = null;

        for (var i = 0; i < files.length; i++) {
            try {
                var newView = require('./' + path.join('node_modules/gaffa/', objectType, files[i]));
                gaffa[objectType].constructors[newView.type] = newView;
            } catch (e) {
                console.log('error was in ' + files[i]);
                console.log(e.stack);
                error = e;
            }
        }

        loaded++;
        callback(error);
    }

    function writeFiles(error, files){
        
        if(error){
            console.log(error.stack);
            return;
        }
        
        for (var i = 0; i < files.length; i++) {
            if(path.extname(files[i]).toLowerCase() === '.js') {
                parseDefinition(path.join(args[0], files[i]), args[1] || args[0]);
            }
        }
    }

    function serialise(error){
        if(!error && loaded === 3){
            if(args[0]){
                fs.stat(args[0], function(error, stats){
                    if(error){
                        console.log(error.stack);
                        return;
                    }

                    if(stats.isDirectory()){
                        fs.readdir(args[0], writeFiles);
                    } else {
                        parseDefinition(args[0], args[1] || path.dirname(args[0]), function(error) {
                            window.close();
                        });
                    }
                });
            }
        }
    }

    function parseDefinition(fileName, destination, callback){
        fs.readFile(fileName, function (error, data) {
            if(error){
                console.log(error.stack);
                return;
            }

            var viewData = '';

            try {
                viewData = JSON.stringify(eval(data.toString()));
            } catch (e) {
                console.log(e.stack);
            }

            fs.writeFile(path.join(destination, path.basename(fileName, path.extname(fileName)) + '.json'), 
                viewData, function (error) {
                    if(error){
                        console.log(error.stack);
                        return;
                    }

                    if(callback && typeof callback === 'function'){
                        callback();
                    }
            });
        });
    }

    window.onload = function () {
            fs.readdir('./node_modules/gaffa/views/', function(error, files){
                if(error){
                    console.log(error.stack);
                    return;
                }

                loadDem(files, 'views', serialise);
            });

            fs.readdir('./node_modules/gaffa/actions/', function(error, files){
                if(error){
                    console.log(error.stack);
                    return;
                }

                loadDem(files, 'actions', serialise);
            });

            fs.readdir('./node_modules/gaffa/behaviours/', function(error, files){
                if(error){
                    console.log(error.stack);
                    return;
                }

                loadDem(files, 'behaviours', serialise);
            });
    };

}());