var gulp = require('gulp');
var requireDir = require('require-dir');

var tasks = requireDir("./gulp-tasks");

gulp.task('default', function() {
    
});
for(var filename in tasks) {
    if(tasks.hasOwnProperty(filename)) {
        for(var taskName in tasks[filename]) {
            if(tasks[filename].hasOwnProperty(taskName)) {
                gulp.task(taskName, tasks[filename][taskName]);
            }
        }
    }
}
