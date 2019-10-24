(() => {

  'use strict';

  /**************** Gulp.js 4 configuration ****************/

  const

    // development or production
    devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

    // config
    config = {
      projectName : 'Gulp 4',
      host        : 'http://gulp-4.local/'
    },

    // directory locations
    dir = {
      src         : 'src/',
      build       : 'htdocs/assets/',
      tpl         : 'templates/'
    },

    // modules
    gulp          = require('gulp'),
    del           = require('del'),
    noop          = require('gulp-noop'),
    newer         = require('gulp-newer'),
    size          = require('gulp-size'),
    imagemin      = require('gulp-imagemin'),
    sass          = require('gulp-sass'),
    postcss       = require('gulp-postcss'),
    cleanCss      = require('gulp-clean-css'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    notify        = require("gulp-notify"),
    sourcemaps    = devBuild ? require('gulp-sourcemaps') : null,
    browsersync   = devBuild ? require('browser-sync').create() : null;


  console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean task ****************/

  function clean() {
    return del([ dir.build ]);
  }
  exports.clean = clean;
  exports.wipe = clean;


  /**************** templates task ****************/
  
  const tplConfig = {
    taskName      : 'Templates',
    src           : dir.tpl + '**/*.{html,htm,twig}',
  };

  function templates() {
    return gulp.src(tplConfig.src)
      .pipe(notify({ 
        message: '✔ ' + config.projectName + ' | ' + tplConfig.taskName + ' task complete.',
        onLast: true
      }));
  }
  exports.templates = templates;


  /**************** favicon task ****************/
  
  const faviconConfig = {
    taskName      : 'Favicon',
    src           : dir.src + 'favicon/**/*',
    build         : dir.build + 'favicon/',
  };

  function favicon() {
    return gulp.src(faviconConfig.src)
      .pipe(newer(faviconConfig.build))
      .pipe(gulp.dest(faviconConfig.build))
      .pipe(notify({ 
        message: '✔ ' + config.projectName + ' | ' + faviconConfig.taskName + ' task complete.',
        onLast: true
      }));
  }
  exports.favicon = favicon;


  /**************** fonts task ****************/
  
  const fontsConfig = {
    taskName      : 'Fonts',
    src           : dir.src + 'fonts/**/*.{eot,svg,ttf,woff,woff2}',
    build         : dir.build + 'fonts/',
  };

  function fonts() {
    return gulp.src(fontsConfig.src)
      .pipe(newer(fontsConfig.build))
      .pipe(gulp.dest(fontsConfig.build))
      .pipe(notify({ 
        message: '✔ ' + config.projectName + ' | ' + fontsConfig.taskName + ' task complete.',
        onLast: true
      }));
  }
  exports.fonts = fonts;


  /**************** images task ****************/

  const imgConfig = {
    taskName      : 'Images',
    src           : dir.src + 'img/**/*',
    build         : dir.build + 'img/',

    minOpts: [
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: true},
          {removeUselessStrokeAndFill: true},
          {removeEmptyAttrs: true}
        ]
      })
    ]
  };

  function images() {

    return gulp.src(imgConfig.src)
      .pipe(newer(imgConfig.build))
      .pipe(imagemin(imgConfig.minOpts))
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(imgConfig.build))
      .pipe(notify({ 
        message: '✔ ' + config.projectName + ' | ' + imgConfig.taskName + ' task complete.',
        onLast: true
      }));
  }
  exports.images = images;


  /**************** styles task ****************/

  const stylesConfig = {

    taskName         : 'Styles',
    src         : dir.src + 'scss/main.scss',
    watch       : dir.src + 'scss/**/*',
    build       : dir.build + 'css/',
    sassOpts: {
      sourceMap       : devBuild,
      outputStyle     : 'nested',
      imagePath       : '/img/',
      precision       : 3,
      errLogToConsole : true
    },

    postCSS: [
      require('postcss-assets')({
        loadPaths: ['img/'],
        basePath: dir.build
      }),
      require('autoprefixer')({
        overrideBrowserslist: ['last 6 versions']
      })
    ]

  };

  function styles() {

    return gulp.src(stylesConfig.src)
      .pipe(sourcemaps.init())
      .pipe(sass(stylesConfig.sassOpts).on('error', sass.logError))
      .pipe(postcss(stylesConfig.postCSS))
      .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
      .pipe(sourcemaps.write('./maps'))
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(stylesConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop())
      .pipe(notify({
        message: '✔ ' + config.projectName + ' | ' + stylesConfig.taskName + ' task complete.',
        onLast: true
      }));

  }
  exports.styles = gulp.series(images, styles);


  /**************** scripts task ****************/

  const scriptsConfig = {

    taskName         : 'Scripts',
    src         : [
      dir.src + 'js/scripts/plugins/**/*.js',
      dir.src + 'js/scripts/utilities/**/*.js',
      dir.src + 'js/scripts/**/*.js',
    ],
    watch       : dir.src + 'js/scripts/**/*.js',
    build       : dir.build + 'js/'

  };

  function scripts() {

    return gulp.src(scriptsConfig.src)
      .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(scriptsConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop())
      .pipe(notify({
        message: '✔ ' + config.projectName + ' | ' + scriptsConfig.taskName + ' task complete.',
        onLast: true
      }));

  }
  exports.scripts = scripts;


  /**************** vendors task ****************/

  const vendorsConfig = {

    taskName         : 'Vendors',
    src         : [
      dir.src + 'js/vendors/jquery/**/*.js',
      dir.src + 'js/vendors/**/*.js',
    ],
    watch       : dir.src + 'js/vendors/**/*.js',
    build       : dir.build + 'js/'

  };

  function vendors() {

    return gulp.src(vendorsConfig.src)
      .pipe(sourcemaps.init())
      .pipe(concat('vendors.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(vendorsConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop())
      .pipe(notify({
        message: '✔ ' + config.projectName + ' | ' + vendorsConfig.taskName + ' task complete.',
        onLast: true
      }));

  }
  exports.vendors = vendors;



  /**************** server task (now private) ****************/

  const syncConfig = {
    proxy : config.host,
  };

  // browser-sync
  function server(done) {
    if (browsersync) browsersync.init(syncConfig);
    done();
  }

  // browser-sync reload
  function browserSyncReload(done) {
    browsersync.reload();
    done();
  }


  /**************** watch task ****************/

  function watch(done) {

    // templates changes
    gulp.watch(tplConfig.src, gulp.series(templates, browserSyncReload));

    // images changes
    gulp.watch(imgConfig.src, images);

    // styles changes
    gulp.watch(stylesConfig.watch, styles);

    // vendors changes
    gulp.watch(vendorsConfig.watch, vendors);

    // scripts changes
    gulp.watch(scriptsConfig.watch, scripts);

    done();

  }

  /**************** default task ****************/

  exports.default = gulp.series(
    exports.favicon,
    exports.fonts,
    // exports.images, // auto run before styles task
    exports.vendors,
    exports.scripts,
    exports.styles,
    watch,
    server
  );

})();
