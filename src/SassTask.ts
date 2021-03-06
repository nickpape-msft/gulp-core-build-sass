import {
GulpTask
} from 'gulp-core-build';

export interface ISassTaskConfig {
  sassMatch?: string[];
  commonModuleTemplate: string;
  amdModuleTemplate: string;
}

export class SassTask extends GulpTask<ISassTaskConfig> {
  public name = 'sass';
  public taskConfig: ISassTaskConfig = {
    sassMatch: [
      'src/**/*.scss'
    ],
    commonModuleTemplate:
      `require('load-themed-styles').loadStyles(<%= content %>);`,
    amdModuleTemplate:
      `define(['load-themed-styles'], function(loadStyles) { loadStyles.loadStyles(<%= content %>); });`
  };

  public executeTask(gulp, completeCallback): any {
    let sass = require('gulp-sass');
    let cleancss = require('gulp-clean-css');
    let texttojs = require('gulp-texttojs');
    let merge = require('merge2');

    let commonJSResult = gulp.src(this.taskConfig.sassMatch)
      .pipe(sass.sync({
        importer: (url, prev, done) => ({ file: patchSassUrl(url) })
      }).on('error', sass.logError))
      .pipe(cleancss({
        advanced: false
      }))
      .pipe(texttojs({
        ext: '.scss.js',
        isExtensionAppended: false,
        template: this.taskConfig.commonModuleTemplate
      }))
      .pipe(gulp.dest(this.buildConfig.libFolder));

    if (this.buildConfig.libAMDFolder) {
      let amdResult = gulp.src(this.taskConfig.sassMatch)
        .pipe(sass.sync({
          importer: (url, prev, done) => ({ file: patchSassUrl(url) })
        }).on('error', sass.logError))
        .pipe(cleancss({
          advanced: false
        }))
        .pipe(texttojs({
          ext: '.scss.js',
          isExtensionAppended: false,
          template: this.taskConfig.amdModuleTemplate
        }))
        .pipe(gulp.dest(this.buildConfig.libAMDFolder));

      return merge(commonJSResult, amdResult);
    }

    return commonJSResult;
  }
}

function patchSassUrl(url) {
  if (url[0] === '~') {
    url = 'node_modules/' + url.substr(1);
  } else if (url === 'stdin') {
    url = '';
  }

  return url;
}
