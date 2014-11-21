/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-11-20[14:55:17]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
"use strict";

var path = require('path'),
    extend = require('extend'),
    chalk = require('chalk'),
    fs = require('fs'),
    async = require('async'),
    exec = require('child_process').exec;

var PYTHON = path.join(__dirname, '..', 'py', 'index.py');
var meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

/**
 * Global options.
 *
 * @type {Object}
 */
var gOptions = {
    /**
     * Template root directory.
     *
     * @type {String}
     * @since 0.1.0
     */
    template_dirs: 'templates'
};


function checkEnv() {
    async.series([
        function(cb) {
            exec('python -c "import django; print(django.get_version())"', function(err, version) {
                if (err || !/^1\.7/.test(version)) {
                    return cb(new Error('Django 1.7 environment is not working'));
                }
                cb();
            });
        }
    ], function(err) {
        if (err) {
            console.error(chalk.red('\nFATAL: ' + err.message + '\n'));
        }
    });
}

var Django = {
    version: meta.version,
    /**
     * Set configurations.
     *
     * @param  {Object} options
     * @return {this}
     * @since 0.1.0
     */
    configure: function(options) {
        checkEnv();
        gOptions = extend({}, gOptions, options || {});
        return this;
    },
    /**
     * Render a template file.
     *
     * @param  {String}   tpl
     * @param  {Object}   data
     * @param  {Function} callback
     * @since 0.1.0
     */
    renderFile: function(tpl, data, callback) {

        if (arguments.length < 3) {
            callback = data;
            data = {};
        }

        if (!tpl || tpl.constructor !== String) {
            return callback(new Error('"tpl" requires a non-empty string'));
        }

        if ('function' !== typeof callback) {
            return callback(new Error('"callback" requires a function'));
        }

        var cmd, params = [gOptions.template_dirs, tpl, data].map(function(item, idx, arr) {
            return (idx === arr.length - 1) ? encodeURIComponent(JSON.stringify(item)) : encodeURIComponent(item);
        });

        cmd = 'python ' + PYTHON + ' "' + params.join('" "') + '"';

        return exec(cmd, function(err, content) {
            callback(err, content ? decodeURIComponent(content) : content);
        });
    }
};

module.exports = Django;