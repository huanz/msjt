var gulp = require('gulp'),
    tinypng = require('gulp-tinypng'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    useref = require('gulp-useref'),
    closureCompiler = require('google-closure-compiler-js').gulp(),
    filter = require('gulp-filter');

var config = {
    src: './',
    dist: './dist/',
    autoprefixer: {
        browsers: [
            'ie >= 8',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 2.3',
            'bb >= 10'
        ]
    },
    tinypng: '7pDGmj3C2UE0DE38dUI0zHpmcqHYMQUO',
    imagemin: {
        optimizationLevel: 7,
        use: [pngquant({ quality: '80-100', speed: 1 })]
    }
}

gulp.task('tinypng', function () {
    gulp.src(config.src + 'res/**/*.png')
        .pipe(tinypng(config.tinypng))
        .pipe(gulp.dest(config.dist + 'res'));
});

gulp.task('image', function () {
    return gulp.src(config.src + 'res/**/*.png')
        .pipe(cache(imagemin(config.imagemin)))
        .pipe(gulp.dest(config.dist + 'res'));
});

gulp.task('style', function () {
    return gulp.src(config.src + 'css/**/*.css')
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(minifycss())
        .pipe(gulp.dest(config.dist + 'css'));
});

gulp.task('static', function () {
    var cssFilter = filter('**/*.css', { restore: true });
    return gulp.src(config.src + 'index.html')
        .pipe(useref())
        .pipe(cssFilter)
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(minifycss())
        .pipe(cssFilter.restore)
        .pipe(gulp.dest(config.dist));
});

var fs = require('fs');
var path = require('path');


gulp.task('copy', function () {
    try {
        fs.mkdirSync(config.dist);
    } catch (error) {

    }
    var project = JSON.parse(JSON.stringify(require('./project.json')));
    delete project.modules;
    delete project.jsList;
    project.debugMode = 0;
    project.showFPS = false;
    fs.writeFileSync(path.join(config.dist, 'project.json'), JSON.stringify(project), 'utf8');
    return gulp.src(['./res/favicon.ico', './res/**/*.pkgJson', './res/**/*.mp3', './res/**/*.ttf', './res/**/*.woff'])
        .pipe(gulp.dest(config.dist + 'res'));
});

/**
 * @desc 获取js列表
 */
function getJsList() {
    var project = require('./project.json');
    var modules = require(path.join(__dirname, project.engineDir, 'moduleConfig.json'));

    var userJsList = project.jsList;
    userJsList.push(project.main || 'main.js');

    var gameModules = project.modules;
    if (!gameModules || !gameModules.length) {
        gameModules = ['core'];
    }

    var ccJsList = [path.join(project.engineDir, modules.bootFile)];
    if (project.renderMode !== 1 && gameModules.indexOf('base4webgl') === -1) {
        gameModules.push('base4webgl');
    }
    var jsAddedCache = {
        'Base64Images.js': true,
        'CCDebugger.js': true
    };
    var getCcJsModule = function (moduleMap, moduleName) {
        if (jsAddedCache[moduleName]) {
            return null;
        }
        jsAddedCache[moduleName] = true;
        moduleMap[moduleName].forEach(function (item) {
            if (!jsAddedCache[item]) {
                var ext = path.extname(item);
                if (ext === '') {
                    var arr = getCcJsModule(moduleMap, item);
                    if (arr) {
                        ccJsList = ccJsList.concat(arr);
                    }
                } else if (ext === '.js') {
                    ccJsList.push(path.join(project.engineDir, item));
                }
                jsAddedCache[item] = true;
            }
        });
    };

    gameModules.forEach(function (item) {
        var arr = getCcJsModule(modules.module, item);
        if (arr) {
            ccJsList = ccJsList.concat(arr);
        }
    });
    return ccJsList.concat(userJsList);
}

gulp.task('js', function () {
    return gulp.src(getJsList())
        .pipe(closureCompiler({
            compilationLevel: 'ADVANCED',
            jsOutputFile: 'game.js'
        }))
        .pipe(gulp.dest(config.dist + 'js'));
});

gulp.task('build', ['copy', 'static', 'image', 'js']);