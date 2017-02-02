const gulp = require('gulp');
const stylus = require('gulp-stylus');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');
const gulpLoadPlugins = require('gulp-load-plugins');
const mainBowerFiles = require('main-bower-files');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

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
        .pipe($.newer('./dist'))
        .pipe(gulp.dest('./dist'))
        .pipe($.size({title: 'copy html'}));

    return gulp.src(['./app/fonts/**/*'])
        .pipe($.newer('./dist/fonts'))
        .pipe(gulp.dest('./dist/fonts'))
        .pipe($.size({title: 'copy fonts'}))
});

gulp.task('styles', () => {
    gulp.src(['./app/css/*.styl', './app/css/*.css'])
        .pipe($.newer('./dist/css'))
        .pipe(plumber())
        .pipe($.if('*.styl', $.stylus()))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    gulp.src(['./app/js/*.js'])
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('serve', ['default'], () => {
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
        // server: ['.tmp', 'app'],
        server: './dist',
        port: 3000
    });

    gulp.watch(['app/**/*.html'], ['copy', reload]);
    gulp.watch(['app/css/**/*.{styl,css}'], ['styles']);
    gulp.watch(['app/js/**/*.js'], ['scripts', reload]);
    gulp.watch(['app/img/**/*'], reload);
});

gulp.task('default', ['clean'], cb =>
    runSequence(
        'styles',
        ['scripts', 'images','copy','bowerfiles'],
        cb
    )
);