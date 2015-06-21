module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    uglify: {
      compressed: {
        files: {
          'dist/streetviewanimator.min.js': ['src/main.js','src/*.js']
        },
        options: {
          sourceMap: true,
          sourceMapName: 'dist/streetviewanimator.min.js.map'
        }
      },
      uncompressed: {
        files: {
          'dist/streetviewanimator.js': ['src/main.js','src/*.js']
        },
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          preserveComments: true,
          sourceMap: true,
          sourceMapName: 'dist/streetviewanimator.js.map'
        }
      }
    },
    watch: {
      uglify: {
        files: ['src/*.js'],
        tasks: ['uglify:compressed', 'uglify:uncompressed', 'notify:watch'],
        options: {
          nospawn: true
        }
      }
    },
    notify: {
      watch: {
        options: {
          title: 'Task Complete',  // optional
          message: 'JS compiled and minified', //required
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-notify');
  grunt.registerTask('default', ['watch']);
};