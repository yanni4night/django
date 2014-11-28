module.exports = (grunt)=>

    (require 'time-grunt') grunt
    (require 'load-grunt-tasks') grunt

    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
            files: ['*.js', 'lib/*.js']
        nodeunit:
            tests: ['test/*_test.js']
        coveralls:
            all:
                src: 'coverage/lcov.info'

    grunt.registerTask 'test', ['jshint', 'nodeunit']
    grunt.registerTask 'default', ['test']
    grunt.registerTask 'test-coveralls', ['test', 'coveralls']
