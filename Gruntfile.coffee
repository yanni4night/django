module.exports = (grunt)=>

    (require 'time-grunt') grunt
    (require 'load-grunt-tasks') grunt

    grunt.initConfig
        nodeunit:
            tests: ['test/*_test.js']

    grunt.registerTask 'test', ['nodeunit']
    grunt.registerTask 'default', ['test']