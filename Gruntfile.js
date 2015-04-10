module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'assets/js/src/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    browserify: {
      plugin: {
        files: {
          'assets/js/lazyload-liveblog-entries.js': ['assets/js/src/LiveblogLazyloader.js']
        }
      }

    },
    wp_readme_to_markdown: {
      plugin: {
        files: {
          'README.md': 'readme.txt'
        }
      }
    },
    watch: {
      options: {
        liveReload: true
      },
      files: ['<%= jshint.files %>'],
      tasks: ['jshint','browserify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.loadNpmTasks('grunt-wp-readme-to-markdown');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint','browserify']);

};
