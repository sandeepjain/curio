module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
        development: {
            options: {
                paths: ["css"]
            },
            files: {
                "css/stylesheet.css": "css/libs/project.less"
            }
        }
    },
    cmq: {
        options: {},
        your_target: {
            files: {
                'css/tmp/': 'css/stylesheet.css'
            }
        }
    },
    cssmin: {
        options: {
            keepSpecialComments: 0
        },
      minify: {
        expand: true,
        cwd: 'css/tmp/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    },
    watch: {
        less: {
            files: 'css/libs/**/*.less',
            tasks: ['less']
        },
        css: {
            files: 'css/stylesheet.css',
            tasks: ['cmq', 'cssmin'],
        },
        cssmin: {
            files: 'css/stylesheet.min.css',
            options: {
                livereload: true
            }
        }
    },
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  grunt.registerTask('watchless', ['watch:less']);

};
