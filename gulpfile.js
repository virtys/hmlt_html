const gulp = require('gulp');
// const stylus = require('gulp-stylus');
// const connect = require('gulp-connect');

const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');
const gulpLoadPlugins = require('gulp-load-plugins');
const mainBowerFiles = require('main-bower-files');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// gulp.task('connect', function() {
//     connect.server({
//         root: './dist',
//         livereload: true,
//         port: 3030
//     });
// });

// Optimize images
gulp.task('images', () =>
    gulp.src('app/img/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe($.size({title: 'img'}))
);

//clean all
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('bowerfiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./dist/js'))
});

//copy html files
gulp.task('copy', function () {
    gulp.src(['./app/*', './app/*.html'])
        .pipe(gulp.dest('./dist'))
        .pipe($.size({title: 'copy'}))
})

gulp.task('styles', ()=> {
    gulp.src(['./app/css/*.styl'])
        .pipe($.plumber())
        .pipe($.stulus())
        .pipe(gulp.dest('./dist/css'))
        .pipe($.size({title: 'copy'}))
})


// gulp.task('stylus', function () {
//     gulp.src('./src/styles/style.styl')
//         .pipe(plumber())
//         .pipe(stylus())
//         .pipe(gulp.dest('./'+$dist+'/css'))
//         .pipe(connect.reload());
// });
//
// gulp.task('html', function () {
//     gulp.src('./app/*.html')
//         .pipe(connect.reload());
// });

// gulp.task('js', function () {
//     gulp.src('./app/js/*.js')
//         .pipe(connect.reload());
// });

// gulp.task('watch', function () {
//     gulp.watch(['./app/*.html'], ['html']);
//     gulp.watch(['./src/styles/*.styl'], ['stylus']);
//     gulp.watch(['./app/js/*.js'], ['js']);
// });

// gulp.task('default', ['stylus','connect','watch']);
// gulp.task('default', ['copy']);

gulp.task('default', ['clean'], cb =>
    runSequence(
        ['images','copy','bowerfiles'],
        cb
    )
);