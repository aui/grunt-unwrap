'use strict';

var fs = require('fs');
var path = require('path');
var unwrap = require('./lib/unwrap.js');

module.exports = function(grunt) {

	grunt.registerMultiTask('unwrap', 'the grunt plugin for unwrap', function() {

		var that = this;
		var options = this.options();
		var dest = this.files[0].dest;
        var base = path.resolve(options.base || './');
        var globalBase = path.resolve(options.globalBase || './global_modules');
        var namespace = options.namespace || 'this';
        var banner = options.banner || '';

        if (path.extname(dest) === '.js') {
            options.runtime = path.basename(dest);
            options.output = path.dirname(dest);
        } else {
        	options.output = dest;
        }

		if (!fs.existsSync(base)) {
		    grunt.fail.warn('`options.base` is not a directory');
		}


		this.files.forEach(function (f) {

			var fileList = f.src.filter(function (filepath) {

	            if (!grunt.file.exists(filepath)) {
	                grunt.log.warn('Source file "' + filepath + '" not found.');
	                return false;
	            } else {
	                return true;
	            }

	        }).map(function (filepath) {
	        	return path.relative(base, filepath);
	        }).forEach(function (target) {

	        	var output = banner;

	        	output += unwrap({
	        		base: base,
	        		globalBase: globalBase,
	        		target: target,
	        		name: options.name,
	        		namespace: namespace
	        	});

	        	grunt.file.write(f.dest, output);
	        	grunt.log.writeln('File ' + f.dest + ' created.');
	        });
		});

		
	});
};
