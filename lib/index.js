/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-11-20[14:55:17]:revised
 * 2014-11-22[10:34:58]:use spawn instead of exec in case of buffer overflow
 * 2014-11-22[13:37:39]:use stdin&stdout to communicate with python to avoid long shell arguments
 *
 * @author yanni4night@gmail.com
 * @version 0.1.3
 * @since 0.1.0
 */
"use strict";

var path = require('path'),
    extend = require('extend'),
    chalk = require('chalk'),
    fs = require('fs'),
    async = require('async'),
    childProcess = require('child_process');

var PYTHON = path.join(__dirname, '..', 'py', 'index.py');
var meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

/**
 * Global configurations.
 *
 * @type {Object}
 */
var gConfigurations = {
    /**
     * Template root directory.
     *
     * @type {String}
     * @since 0.1.0
     */
    template_dirs: 'templates'
};

/**
 * Check dependencies.
 *
 * @since 0.1.1
 * @throws {Error} If checking failed.
 */
function checkEnv() {
    async.series([
        function(cb) {
            childProcess.exec('python -c "import django; print(django.get_version())"', function(err, version) {
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
     * @param  {Object} configurations
     * @return {this}
     * @since 0.1.0
     */
    configure: function(configurations) {
        checkEnv();
        gConfigurations = extend({}, gConfigurations, configurations || {});
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
        var args, proc, out = '',
            err = '',
            strData;

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

        try {
            //Make sure mock data could be stringified
            strData = JSON.stringify(data);
        } catch (e) {
            return callback(e);
        }

        args = [PYTHON, gConfigurations.template_dirs, tpl].map(function(item, idx) {
            return idx ? encodeURIComponent(item) : item;
        });

        proc = childProcess.spawn('python', args);
        //We use stdin to pass the mock data to avoid long shell arguments
        proc.stdin.write(strData + '\n'); //For python reading a line.

        proc.stdout.on('data', function(data) {
            //Here we get no string but buffer
            out += data.toString('utf-8');
        });
        proc.stderr.on('data', function(data) {
            err += data.toString('utf-8');
        });
        //What if blocked? We ignored it because this is not for production.
        proc.on('exit', function() {
            if (err) {
                return callback(new Error(err));
            } else {
                return callback(null, out);
            }
        });
    }
};

module.exports = Django;