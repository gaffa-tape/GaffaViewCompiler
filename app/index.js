(function(){

	var fs = require('fs'),
		path = require('path'),
		gui = require('nw.gui'),
		args= gui.App.argv,
		gaffa = require('gaffa'),
		loaded = 0;

	//gui.Window.get().showDevTools();

	function loadDem(files, objectType, callback){
		for (var i = 0; i < files.length; i++) {
			try {
				var newView = require('./' + path.join('node_modules/gaffa/', objectType, files[i]));
				gaffa[objectType][newView.type] = newView;
			} catch (e) {
                console.log('error was in ' + files[i]);
				console.log(e);
			}
		}

		loaded++;
		callback();
	}

	function serialise(){
		if(loaded === 1){
			if(args[0]){
				fs.readdir(args[0], function(error, files){
					for (var i = 0; i < files.length; i++) {
						parseDefinition(path.join(args[0], files[i]), args[1] || args[0]);
					}
				});
			}
		}
	}

	function parseDefinition(fileName, destination){
		var gaffaObject = require(fileName);
		gaffaObject._ = "<script>window.location = window.location<\/script>";

		fs.writeFile(path.join(destination, path.basename(fileName, path.extname(fileName)), fileName + '.json'), gaffaObject, function (error) {
            if (error) {
                console.log(error);
            }
        });

	}

	window.onload = function () {
			fs.readdir('./node_modules/gaffa/views/', function(error, files){
				console.log(files);

				loadDem(files, 'views', serialise);
			});

			// fs.readdir('./node_modules/gaffa/actions/', function(error, files){
			// 	loadDem(files, 'actions', serialise);
			// });

			// fs.readdir('./node_modules/gaffa/behaviours/', function(error, files){
			// 	loadDem(files, 'behaviours', serialise);
			// });

		
	};

}());