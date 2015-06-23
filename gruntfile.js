/// <binding BeforeBuild='less' ProjectOpened='watch' />
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        },
        replace: {
            readmeVersion: {
                src: ['README.md'],
                overwrite: true,
                replacements: [{
                    from: /### [0-9]+\.[0-9]+\.[0-9]+/i,
                    to: '### <%= pkg.version %>'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('build', ['uglify', 'less', 'version:build:patch', 'replace:readmeVersion']);
};