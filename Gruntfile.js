module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			js: {
				files: ['src/js/*.js'],
				tasks: ['uglify']
			},
			css: {
				files: ['src/css/*.css'],
				tasks: ['cssmin']
			},
			html: {
				files: ['src/*.html'],
				tasks: ['htmlmin']
			}
		},
		uglify: {
			options: {
				mangle: false
			},
    		js: {
      			files: [{
			    	expand: true,
			    	cwd: 'src/',
			    	src: ['**/*.js'],
			    	dest: 'dist/'
			   	}]
        	}
        },
        htmlmin: {
    		dist: {
      			options: {
        			removeComments: true,
        			collapseWhitespace: true
      			},
      			files: [{
			    	expand: true,
			    	cwd: 'src/',
			    	src: ['**/*.html'],
			    	dest: 'dist/'
			   	}]
    		}
  		},
  		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.css',],
					dest: 'dist/',
					ext: '.css'
				}]
			}
		},
		'gh-pages': {
			options: {
				base: 'dist',
			},
			src: ['**']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.registerTask('default', ['watch']);
};