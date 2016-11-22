var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');


var MODULE_NOM = "front";
var babelPresets = ["es2015", "react"];

var exports = {};
var sourceDir = "./src/AppBundle/Resources/src/js/" + MODULE_NOM + "/";
var distDir = "./web/bundles/app/js";
var files = [ // fichiers a minifier
        sourceDir + "main.js"
    ];

exports['build-' + MODULE_NOM + '-dev'] = function () {
  process.env.NODE_ENV = "development";
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: sourceDir + "main.js",
    debug: false
  }).transform(babelify, {presets: babelPresets});

  return b.bundle()
    .pipe(source('' + MODULE_NOM + '.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distDir));
};
exports['build-' + MODULE_NOM + ''] = function () {
  process.env.NODE_ENV = "production";
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: sourceDir + "main.js",
    debug: true
  }).transform(babelify, {presets: babelPresets});

  return b.bundle()
    .pipe(source('' + MODULE_NOM + '.min.js'))
    .pipe(buffer())
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
    .pipe(gulp.dest(distDir));
};
exports['watch-' + MODULE_NOM + ''] = function() {   
    var watcher = gulp.watch(files, ["build-" + MODULE_NOM + "-dev"]);
};
module.exports = exports;
