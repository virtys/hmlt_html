const gulp = require('gulp');
const stylus = require('gulp-stylus');
// const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
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

gulp.task('bowerfiles', () => {
    return gulp.src(mainBowerFiles())
        .pipe($.if('*.css', gulp.dest('./dist/css')))
        .pipe($.if('*.js', gulp.dest('./dist/js')))
});

//copy html files
gulp.task('copy', () => {
    gulp.src(['./app/*', './app/*.html'])
        .pipe(gulp.dest('./dist'))
        .pipe($.size({title: 'copy'}))
});

gulp.task('styles', () => {
    gulp.src(['./app/css/*.styl', './app/css/*.css'])
        .pipe(plumber())
        .pipe($.if('*.styl', $.stylus()))
        .pipe(gulp.dest('./dist/css'))
        .pipe($.size({title: 'copy'}))
});

gulp.task('scripts', () => {
    gulp.src(['./app/js/*.js'])
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('serve', ['scripts', 'styles'], () => {
    browserSync({
        notify: false,
        // Customize the Browsersync console logging prefix
        logPrefix: 'WSK',
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app'],
        port: 3000
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{styl,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
    gulp.watch(['app/img/**/*'], reload);
});

gulp.task('serve:dist', ['default'], () =>
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist',
        port: 3001
    })
);

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
        'styles',
        ['scripts', 'images','copy','bowerfiles'],
        cb
    )
);