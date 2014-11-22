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

var django = require('../lib/');

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
        django.renderFile('index.html', {
            name: 'django',
            desc: '中文'
        }, function(err, content) {
            test.ok(!err, 'No Error Occured');
            test.ok(/django/.test(content), 'Variable injected');
            test.ok(!!~content.indexOf('中文'), 'East-aria language injected');
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
        illegalData.inner = illegalData;//circular reference

        django.renderFile('index.html', illegalData, function(err, content) {
            test.ok(/circular/.test(err.message), 'Throw exception when data illegal');
            test.done();
        });
    }
};