// Some views require a global window object to be present
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
    };
};

var gvc = {},
    fs = require('graceful-fs'),
    path = require('path'),
    browserify = require('browserify'),
    gelTransform = require('gel-transform');

gvc.transform = function transform(file) {
    return gelTransform(file);
};

gvc.parse = function parse (filename, outputPath, callback) {
    var object = browserify(filename).transform(gvc.transform);

    object.bundle({}, function (error, data) {
        if (error) return callback(error);

        try {
            // Dirty hack for finding which function to call on the Browserified module
            var entryPoint = data.split(/\n/).slice(-2)[0].split('[').slice(-1)[0].replace('])', '');
            var json = JSON.stringify(eval(data)(entryPoint));

            // Cache buster
            json = json.replace('{',
                '{"_" : "<style>*{display:none;}</style><script>window.location = window.location + \'?_bust=\' + +new Date();<\/script>", ');

            outputFilename = path.join(outputPath, path.basename(filename, path.extname(filename)) + '.json');

            fs.writeFile(outputFilename, json, function (error) {
                if (error) return callback(error);

                callback(null, json);
            });
        } catch(exception){
            callback(exception);
        }
    });
};

module.exports = gvc;