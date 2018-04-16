module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	cssmin : {
        compress : {
            files : {
                "assets/css/all.min.css" : ['assets/css/*.css']
            }
        }
    },
   jekyll: {
       serve: true,
       options: {
           drafts: true,
           watch: true,
           safe: true,
           future: true,
           livereload: true
       }
   }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jekyll');

  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'serve']);

};
