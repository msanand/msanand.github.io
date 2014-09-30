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
		}
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['cssmin']);

};
