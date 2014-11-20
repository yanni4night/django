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

var path = require('path'),
    extend = require('extend'),
    fs = require('fs'),
    exec = require('child_process').exec;

var PYTHON = path.join(__dirname, '..', 'py', 'index.py');
var meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

var Django = {
    version: meta.version,
    options: {
        /**
         * Template root directory.
         * 
         * @type {String}
         * @since 0.1.0
         */
        template_dirs: 'templates'
    },
    /**
     * Set configurations.
     *
     * @param  {Object} options
     * @return {this}
     * @since 0.1.0
     */
    configure: function(options) {
        this.options = extend({}, this.options, options || {});
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

        var cmd, params = [Django.options.template_dirs, tpl, data].map(function(item, idx, arr) {
            return (idx === arr.length - 1) ? encodeURIComponent(JSON.stringify(item)) : encodeURIComponent(item);
        });

        cmd = 'python ' + PYTHON + ' "' + params.join('" "') + '"';

        return exec(cmd, function(err, content) {
            callback(err, content ? decodeURIComponent(content) : content);
        });
    }
};

module.exports = Django;