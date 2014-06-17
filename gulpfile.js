var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var exec = require('child_process').exec;
var fs = require("fs");

gulp.task('examples', function(callback) {
	var data = "if(!window.ixExamples) window.ixExamples = {};";
	fs.readdirSync('examples').sort().forEach(function(filename) {
		if(m = (/^(.+?)\.ix$/.exec(filename))) {
			data += "\nwindow.ixExamples." + m[1].replace(/[^a-z0-9]+/g, '_') + " = " + JSON.stringify(fs.readFileSync('examples/' + filename, "UTF-8").replace(/^\s+|\s+$/g, ''));
		}
	});
	fs.writeFile('bin/ix.examples.js', data, null, callback);
});

gulp.task('app', ['examples'], function () {
	gulp.src('src/ix.co', {read: false})
		.pipe(browserify({standalone: "Ix", transform: ['cocoify'], extensions: ['.co']}))
		.pipe(uglify('ix.dev.js', {mangle: false, output: {beautify: true}, compress: false}))
		.pipe(gulp.dest('bin'))
		.pipe(uglify("ix.rel.js"))
		.pipe(gulp.dest('bin'));
});

gulp.task('watch', function() {
	gulp.watch(["src/*.co"], ["app"]);
});

gulp.task('default', ["app", "watch"]);
