/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-11-20[14:55:17]:revised
 * 2014-11-22[10:34:58]:use spawn instead of exec in case of buffer overflow
 * 2014-11-22[13:37:39]:use stdin&stdout to communicate with python to avoid long shell arguments
 * 2014-11-24[19:01:30]:add render from source support
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
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
var meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'),
    'utf-8'));

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
    template_dirs: null
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
                childProcess.exec(
                    'python -c "import django; print(django.get_version())"',
                    function(err, version) {
                        if (err || !/^1\.7/.test(version)) {
                            return cb(new Error(
                                'Django 1.7 environment is not working'
                            ));
                        }
                        cb();
                    });
            }
        ], function(err) {
            if (err) {
                console.error(chalk.red('\nFATAL: ' + err.message +
                    '\n'));
            }
        });
    }
    /**
     * Render from a file or source codes.
     *
     * @param  {String}   from     source|file
     * @param  {String}   template
     * @param  {Object}   data
     * @param  {Function} callback
     * @since 0.1.4
     */
function innerRender(from, template, data, callback) {
    var args, proc, out = '',
        err = '',
        base,
        strData;

    if (arguments.length < 4) {
        callback = data;
        data = {};
    }

    if (!template || template.constructor !== String) {
        return callback(new Error('"template" requires a non-empty string'));
    }

    if ('function' !== typeof callback) {
        throw new Error('"callback" requires a function');
    }

    try {
        //Make sure mock data could be stringified
        strData = JSON.stringify(data);
    } catch (e) {
        return callback(e);
    }

    base = gConfigurations.template_dirs;
    //If no template_dirs defined and is rendering a file,
    //we reset the template_dirs to the dirname of the file,
    //and set template as its basename
    //
    //e.g,
    //
    //django.configure({
    //  template_dirs: null
    // });
    //django.renderFile('test/case/index.html');
    //
    //equals
    //
    //django.configure({
    //  template_dirs: 'test/case'
    // });
    //django.renderFile('index.html')
    //
    //That affects @include tag in Django,
    //see https://docs.djangoproject.com/en/1.7/ref/templates/builtins/#include
    //
    if (('file' === from) && !base) {

        base = path.resolve(path.dirname(template));
        template = path.basename(template);
    } 

    args = (('source' === from) ? [PYTHON] : [PYTHON, base, template]).map(function(item, idx) {
        return idx ? encodeURIComponent(item) : item;
    });

    proc = childProcess.spawn('python', args);
    //We use stdin to pass the mock data to avoid long shell arguments
    proc.stdin.write(('source' === from ? (encodeURIComponent(template) +
        '\n') : '') + strData + '\n'); //For python reading a line.

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
            return callback(null, out.replace(/\r(?=\r\n)/mg, '')); //A \r will always be prepend to \r\n
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
     * @since 0.1.0
     */
    renderFile: function() {
        return innerRender.bind(this, 'file').apply(this, arguments);
    },
    /**
     * Render from source.
     *
     * @since 0.1.4
     */
    render: function() {
        return innerRender.bind(this, 'source').apply(this, arguments);
    }
};

module.exports = Django;