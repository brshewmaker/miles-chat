module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			react: {
				files: ['react_components/*.js'],
				tasks: ['concat'],
			},
		},

		concat: {
			dist: {
				src: ['react_components/*.js'],
				dest: 'public/js/react-components.js',
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
};