/// <binding AfterBuild='default' />
module.exports = function (grunt) {

    require("load-grunt-tasks")(grunt);

    var project = {
        dist: "wwwroot",
        app: "app"
    };

    grunt.initConfig({
        project: project,

        bower: {
            install: {
                options: {
                    targetDir: "<%= project.dist %>/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },

        useminPrepare: {
            html: '<%= project.app %>/index.html',
            options: {
            	dest: '<%= project.dist %>',
				staging: 'obj'
            }
        },

        usemin: {
            html: ['<%= project.dist %>/{,*/}*.html'],
            css: ['<%= project.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= project.dist %>'],
            }
        },

        ngtemplates: {
            galleryApp: {
                src: '<%= project.app %>/views/*.html',
                dest: '<%= project.app %>/views/templates.js',
                options: {
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true, removeAttributeQuotes: true }
                }
            }
        },

        clean: ["<%= project.dist %>/css", "<%= project.dist %>/js"],

        less: {
            dev: {
                files: {
                    "<%= project.dist %>/css/site.css": ["<%= project.app %>/less/**/*.less"]
                },
                options: {
                    cleancss: true,
                }
            }
        },

        copy: {
            html: {
                files: {
                    "<%= project.dist %>/index.html": ["app/index.html"]
                }
            }
        },

        filerev: {
            dev: {
                src: [
                '<%= project.dist %>/js/{,*/}*.js',
                '<%= project.dist %>/css/{,*/}*.css',
                '<%= project.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ]
            }
        },

        watch: {
            html: {
                files: ["<%= project.app %>/index.html", "<%= project.app %>/views/*.html"],
                tasks: ["default"]
            },
            js: {
                files: ["<%= project.app %>/**/*.js", "!<%= project.app %>/views/templates.js"],
                tasks: ["default"]
            },
            less: {
                files: ["<%= project.app %>/less/*.less"],
                tasks: ["default"]
            },
            bower: {
                files: ['bower.json'],
                tasks: ['bower:install']
            },
            gruntfile: {
                files: ["gruntfile.js"]
            }
        }
    });

    grunt.registerTask("default", [
        "clean",
        "less",
        "useminPrepare",
        "copy:html",
        "ngtemplates",
        "concat:generated",
        "uglify:generated",
        "filerev",
        "usemin",
    ]);
};