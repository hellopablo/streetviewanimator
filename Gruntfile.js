module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    grunt.initConfig({
        'uglify': {
            'compressed': {
                'files': {
                    'dist/streetviewanimator.min.js': ['src/main.js','src/*.js']
                },
                'options': {
                    'sourceMap': true,
                    'sourceMapName': 'dist/streetviewanimator.min.js.map'
                }
            },
            'uncompressed': {
                'files': {
                    'dist/streetviewanimator.js': ['src/main.js','src/*.js']
                },
                'options': {
                    'mangle': false,
                    'compress': false,
                    'beautify': true,
                    'preserveComments': true,
                    'sourceMap': true,
                    'sourceMapName': 'dist/streetviewanimator.js.map'
                }
            }
        },
        'watch': {
            'uglify': {
                'files': ['src/*.js'],
                'tasks': ['build:js'],
                'options': {
                    'nospawn': true
                }
            }
        },
        'notify': {
            'uglify': {
                'options': {
                    'title': 'Task Complete',
                    'message': 'JS compiled and minified',
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-notify');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('watch:js', ['watch:uglify']);
    grunt.registerTask('build', ['build:js']);
    grunt.registerTask('build:js', ['uglify:compressed', 'uglify:uncompressed', 'notify:uglify']);
};