/* jshint camelcase:false */
module.exports = function(grunt) {
    var jsFiles = 'src/app/**/*.js';
    var otherFiles = [
        'src/app/**/*.html',
        'src/app/**/*.css',
        'src/index.html',
        'src/ChangeLog.html'
    ];
    var gruntFile = 'GruntFile.js';
    var internFile = 'tests/intern.js';
    var jshintFiles = [jsFiles, gruntFile, internFile];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            'default': {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/**/Spec*.js'],
                    vendor: [
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js'
                    ],
                    host: 'http://localhost:8000'
                }
            }
        },
        jshint: {
            files: jshintFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            jshint: {
                files: jshintFiles,
                tasks: ['jshint', 'jasmine:default:build']
            },
            src: {
                files: jshintFiles.concat(otherFiles),
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            uses_defaults: {}
        },
        dojo: {
            prod: {
                options: {
                    // You can also specify options to be used in all your tasks                
                    profiles: ['profiles/prod.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            stage: {
                options: {
                    // You can also specify options to be used in all your tasks                
                    profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            options: {
                // You can also specify options to be used in all your tasks
                dojo: 'src/dojo/dojo.js', // Path to dojo.js file in dojo source
                load: 'build', // Optional: Utility to bootstrap (Default: 'build')
                releaseDir: '../dist',
                require: 'src/app/run.js', // Optional: Module to require for the build (Default: nothing)
                basePath: './src'
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: /<!-- start -->(.|\s)*?<!-- end -->/g,
                        replacement: '<script src=\'dojo/dojo.js\' data-dojo-config="deps:[\'app/run\']"></script>'
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['src/index.html', 'src/ChangeLog.html'],
                    dest: 'dist/'
                }]
            }
        },
        imagemin: { // Task
            dynamic: { // Another target
                options: { // Target options
                    optimizationLevel: 3
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/' // Destination path prefix
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json', 'src/app/package.json', 'src/app/main.js'],
                commit: true,
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'deploy/public-utilities.zip'
                },
                files: [{
                    src: ['dist/**'],
                    dest: '/'
                }]
            }
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task.
    grunt.registerTask('default', ['jasmine:default:build', 'jshint', 'connect', 'watch']);
    grunt.registerTask('build', ['dojo:prod', 'replace:dist', 'newer:imagemin:dynamic', 'compress']);
    grunt.registerTask('stage-build', ['dojo:stage', 'replace:dist', 'newer:imagemin:dynamic', 'compress']);
    grunt.registerTask('travis', ['jshint', 'connect', 'jasmine:default']);
};