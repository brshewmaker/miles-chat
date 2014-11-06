module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			react: {
				files: ['react_components/*.js'],
				tasks: ['concat', 'react'],
			},
		},

		concat: {
			options: {
				banner: '/** @jsx React.DOM */'
			},
			
			dist: {
				src: ['react_components/*.js'],
				dest: 'public/js/react-components.js',
			},
		},

		react: {
			single_file_output: {
				files: {
					'public/js/react-components.js': 'public/js/react-components.js'
				}
			},
		},

	}); // init Config

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
};