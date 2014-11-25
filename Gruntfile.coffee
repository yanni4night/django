module.exports = (grunt)=>

    (require 'time-grunt') grunt
    (require 'load-grunt-tasks') grunt

    grunt.initConfig
        jshint:
            options:
                jshintrc: '.jshintrc'
            files: ['*.js', 'lib/*.js']
        nodeunit:
            options:
                reporter: 'lcov',
                reporterOutput: 'test.lcov',
            tests: ['test/*_test.js']
        coveralls:
            all:
                src: 'test.lcov'
        env:
            coveralls:
                USE_COVERAGE: 1

    grunt.registerTask 'test', ['jshint', 'nodeunit']
    grunt.registerTask 'default', ['test']
    grunt.registerTask 'test-coveralls', ['env', 'test', 'coveralls']