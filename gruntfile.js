/// <binding BeforeBuild='less' ProjectOpened='watch' />
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            compressed: {
                files: {
                    'knockout-select.min.js': 'knockout-select.js'
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
                    'style.min.css': 'style.less'
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
        },
        ts: {
          commonjs : {
              src: 'knockout-select.ts',
              options: {
                  declaration: true,
                  module: 'commonjs',
                  removeComments: false
              }
          },
          amd: {
              src: 'knockout-select.ts',
              options: {
                  declaration: true,
                  module: 'amd',
                  removeComments: false
              }
          }
        },
        jsdoc2md: {
            doc: {
                src: "knockout-select.js",
                dest: "doc/documentation.md",
                options: {
                    private: true,
                    html: true,
                    stats: false
                }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    
    grunt.registerTask('build', ['ts:amd', 'uglify', 'less', 'jsdoc2md:doc']);
    grunt.registerTask('buildVersion', ['build', , 'replace:readmeVersion', 'version:build:patch']);
};