/*
 * ok(value, [message]) - Tests if value is a true value.
 * equal(actual, expected, [message]) - Tests shallow, coercive equality with the equal comparison operator ( == ).
 * notEqual(actual, expected, [message]) - Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
 * deepEqual(actual, expected, [message]) - Tests for deep equality.
 * notDeepEqual(actual, expected, [message]) - Tests for any deep inequality.
 * strictEqual(actual, expected, [message]) - Tests strict equality, as determined by the strict equality operator ( === )
 * notStrictEqual(actual, expected, [message]) - Tests strict non-equality, as determined by the strict not equal operator ( !== )
 * throws(block, [error], [message]) - Expects block to throw an error.
 * doesNotThrow(block, [error], [message]) - Expects block not to throw an error.
 * ifError(value) - Tests if value is not a false value, throws if it is a true value. Useful when testing the first argument, error in callbacks.
 */
'use strict';

var grunt = require('grunt');
var path = require('path');

var django = require('../');

django.configure({
    template_dirs: path.join(__dirname, 'templates')
});

exports.django = {
    setUp: function(done) {
        done();
    },
    version: function(test) {
        test.deepEqual(django.version, grunt.file.readJSON(path.join(__dirname, '..', 'package.json')).version, 'Version followed');
        test.done();
    },
    success: function(test) {
        django.renderFile('index.html', grunt.file.readJSON(path.join(__dirname, 'mock', 'index.json')), function(err, content) {
            test.ok(!err, 'Error Occured');
            test.ok(/YOUTH/.test(content), 'Variable should be injected');
            test.ok(/Copyright/.test(content), '@include');
            test.ok(!!~(content || "").indexOf('青春'), 'East-aria language should be injected');
            grunt.file.write(path.join(__dirname, 'output', 'index.html'), content);
            test.done();
        });
    },
    tplAbsence: function(test) {
        django.renderFile('non-existed.html', function(err, content) {
            test.ok(/TemplateDoesNotExist/.test(err.message), 'Throw exception when file not found');
            test.done();
        });
    },
    illegal_data: function(test) {
        var illegalData = {};
        illegalData.inner = illegalData; //circular reference

        django.renderFile('index.html', illegalData, function(err, content) {
            test.ok(/circular/.test(err.message), 'Throw exception when data illegal');
            test.done();
        });
    },
    from_source: function(test) {
        django.render(grunt.file.read(path.join(__dirname, 'templates', 'source.html')), grunt.file.readJSON(path.join(__dirname, 'mock', 'index.json')), function(err, content) {
            test.ok(!err, 'No Error Occured');
            test.ok(/YOUTH/.test(content), 'Variable not injected');
            test.ok(!!~(content || "").indexOf('青春'), 'East-aria language should be injected');
            grunt.file.write(path.join(__dirname, 'output', 'source.html'), content);
            test.done();
        });
    },
    no_template_dirs: function(test) {
        django.configure({
            template_dirs: null
        });
        django.renderFile('test/templates/index.html', grunt.file.readJSON(path.join(__dirname, 'mock', 'index.json')), function(err, content) {
            test.ok(!err, 'Error Occured');
            test.ok(/YOUTH/.test(content), 'Variable should be injected');
            test.ok(/Copyright/.test(content), '@include');
            test.ok(!!~(content || "").indexOf('青春'), 'East-aria language should be injected');
            grunt.file.write(path.join(__dirname, 'output', 'index.html'), content);
            test.done();
        });
    }
};