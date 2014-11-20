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

exports.render = {
    setUp: function(done) {
        done();
    },
    render: function(test) {
        django.configure({
            template_dirs: path.join(__dirname, 'templates')
        });
        django.renderFile('index.html', {
            name: 'django',
            desc: '中文'
        }, function(err, content) {
            test.ok(!err, 'No Error Occured');
            test.ok(/django/.test(content), 'Variable injected');
            test.ok(!!~content.indexOf('中文'), 'East-aria language injected');
            test.done();
        });
    }
};