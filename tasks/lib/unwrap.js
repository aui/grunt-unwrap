'use strict';

var path = require('path');
var fs = require('fs');

var fs = require('fs');
var path = require('path');

var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var DEFINE_RE = /\bdefine\s*\(([\w\W]*?)\)/g;


function replaceDefine (code, id) {
	return code.replace(DEFINE_RE, function ($, $1) {
		return 'define("' + id + '", ' + $1 + ')';
	});
}


function replaceRequire (code, fn) {
	return code.replace(REQUIRE_RE, function ($, $1, $2) {
		return 'require("' + fn($2) + '")';
	});
}


function toId (id) {
	return id
	.replace(/\\/g, '/')
	.replace(/^\//, '')
	.replace(/\.js$/, '');
}


function isGlobalModule (id) {
	return !/^\./.test(id);
}


function combo (base, globalBase, target, uniq) {

	if (!path.extname(target)) {
		target = target + '.js';
	}

	var file = path.resolve(base, target);
	var dirname = path.dirname(file);
	var id = toId(file.replace(base, ''));
	var map = {};
	var targetContent = fs.readFileSync(file, 'utf-8');
	var requireContent = '';

	uniq[id] = true;
	targetContent = replaceDefine(targetContent, id);
	targetContent = replaceRequire(targetContent, function (uri) {

		var baseDir = base;
		var id;

		if (isGlobalModule(uri)) {
			baseDir = globalBase;
			id = uri;
		} else {
			id = toId(path.resolve(dirname, uri).replace(baseDir, ''));
		}

		if (!uniq[id]) {
			requireContent += combo(baseDir, globalBase, uri, uniq);
		}

		return id;
	});

	return requireContent + '\n\n' + targetContent;
}


module.exports = function (options) {
	var base = options.base;
	var globalBase = options.globalBase;
	var target = options.target;
	var name = options.name;
	var namespace = options.namespace;

	var file = path.resolve(base, target);
	var dirname = path.dirname(file);
	var targetContent = fs.readFileSync(file, 'utf-8');
	var commonjs = fs.readFileSync(__dirname + '/common.js', 'utf-8');
	var template = fs.readFileSync(__dirname + '/template.tpl', 'utf-8');

	var data = {
		name: name,
		commonjs: commonjs,
		namespace: namespace,
		modules: combo(base, globalBase, target, {}),
		id: toId(target)
	};

	return template.replace(/<(.*?)>/g, function ($, $1) {
		return data[$1];
	});
};
