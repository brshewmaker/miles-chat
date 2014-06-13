module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			dist: {
				src: ['react_components/*.js'],
				dest: 'public/js/react-components.js',
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-watch');
};