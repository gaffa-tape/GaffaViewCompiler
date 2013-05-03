(function(){
    var fs = require('fs'),
        path = require('path'),
        gui = require('nw.gui'),
        args= gui.App.argv,
        crel = require('crel');

    // function loadDem(files, objectType, callback){
    //     var error = null;

    //     for (var i = 0; i < files.length; i++) {
    //         try {
    //             var newView = require('./' + path.join('node_modules/gaffa/', objectType, files[i]));
    //             gaffa[objectType].constructors[newView.type] = newView;
    //         } catch (e) {
    //             console.log('error was in ' + files[i]);
    //             console.log(e.stack);
    //             error = e;
    //         }
    //     }

    //     loaded++;
    //     callback(error);
    // }


    function serialise(watchPath, outputPath){
        if(watchPath){
            fs.stat(watchPath, function(error, stats){
                if(error){
                    console.log(error.stack);
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
            console.log(error.stack);
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
                     //   callback();
                    }
            });
        });
    }

    window.onload = function () {

        document.body.appendChild(crel('script', {'src' : args[0]}));

        serialise(args[1], args[2]);



        // fs.readdir('./node_modules/gaffa/views/', function(error, files){
        //     if(error){
        //         console.log(error.stack);
        //         return;
        //     }

        //     loadDem(files, 'views', serialise);
        // });

        // fs.readdir('./node_modules/gaffa/actions/', function(error, files){
        //     if(error){
        //         console.log(error.stack);
        //         return;
        //     }

        //     loadDem(files, 'actions', serialise);
        // });

        // fs.readdir('./node_modules/gaffa/behaviours/', function(error, files){
        //     if(error){
        //         console.log(error.stack);
        //         return;
        //     }

        //     loadDem(files, 'behaviours', serialise);
        // });
    };

}());