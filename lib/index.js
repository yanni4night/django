/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-11-20[14:55:17]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

var path = require('path'),
    extend = require('extend'),
    fs = require('fs'),
    exec = require('child_process').exec;

var PYTHON = path.join(__dirname, '..', 'py', 'index.py');
var meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

var Django = {
    version: meta.version,
    options: {
        template_dirs: 'templates'
    },
    configure: function(options) {
        this.options = extend({}, this.options, options || {});
    },
    renderFile: function(tpl, data, callback) {
        var params = [Django.options.template_dirs, tpl, data].map(function(item, idx, arr) {
            return (idx === arr.length - 1) ? encodeURIComponent(JSON.stringify(item)) : encodeURIComponent(item);
        });
        var cmd = 'python ' + PYTHON + ' "' + params.join('" "') + '"';
        return exec(cmd, function(err, content) {
            callback(err, content ? decodeURIComponent(content) : content);
        });
    }
};

module.exports = Django;