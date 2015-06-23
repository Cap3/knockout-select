/// <binding BeforeBuild='less' ProjectOpened='watch' />
module.exports = function (grunt) {

    grunt.initConfig({
        uglify: {
            compressed: {
                files: {
                    'knockoutSelect-min.js': 'knockoutSelect.js'
                }
            }
        },
        less: {
            compressed: {
                options: {
                    compress: true,
                    optimization: 20,
                    relativeUrls: true
                },
                files: {
                    'style-min.css': 'style.less'
                }
            },
            debug: {
                options: {
                    compress: false,
                    relativeUrls: true
                },
                files: {
                    'style.css': 'style.less'
                }
            }
        },
        version: {
            build: {
                src: ['package.json', 'bower.json']
            }
        }

    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-version');
    
    grunt.registerTask('build', ['uglify', 'less', 'version:build:patch']);
};