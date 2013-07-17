GLOBAL.window = {
    location: {
        pathname: ''
    },
    document: {
        createElement: function () {
            return {
                addEventListener: function () {},
                setAttribute: function () {},
                appendChild: function () {}
            };
        },
        createTextNode: function () {
            return {};
        }
    },
    addEventListener: function () {}
};
GLOBAL.document = GLOBAL.window.document;
GLOBAL.XMLHttpRequest = function () {
    return {
        send: function () {},
        addEventListener: function () {},
        open: function () {},
        setRequestHeader: function () {}
    }
}


var fs = require('fs'),
    path = require('path'),
    browserify = require('browserify'),
    temp = require('temp');


function parseDefinition (filename, outputPath, callback) {
    var object = browserify(filename).transform('gel-transform');
    
    object.bundle({}, function (error, data) {
        if (error) return callback(error);
        
        var json = JSON.stringify(eval(data)(1));
        json = json.replace('{', 
            '{"_" : "<style>*{display:none;}</style><script>window.location = window.location + \'?_bust=\' + +new Date();<\/script>", ');
            
        outputFilename = path.join(outputPath, path.basename(filename, path.extname(filename)) + '.json');
        
        fs.writeFile(outputFilename, json, function (error) {
            if (error) return callback(error);
            
            callback(null, json);
        });
    });
}

module.exports = parseDefinition;