# gulp-core-build-sass
`gulp-core-build-sass` is a plugin for `gulp-core-build` which introduces the ability to compile SASS files to CSS. 

# Tasks
## SassTask

### Description
This task invokes `gulp-sass` to compile source SASS files into a CommonJS module which uses `load-themed-styles` to load styles onto the page. If the `libAmdFolder` is specified globally, this task will also output an AMD module. Various templates may be specified.

### Config
```typescript
 interface ISassTaskConfig {
  sassMatch?: string[];
  commonModuleTemplate: string;
  amdModuleTemplate: string;
}
```
* **

Usage (and defaults):
```typescript
build.webpack.setConfig({
    sassMatch: [
      'src/**/*.scss'
    ],
    commonModuleTemplate: "require('load-themed-styles').loadStyles(<%= content %>);",
    amdModuleTemplate: "define(['load-themed-styles'], function(loadStyles) { loadStyles.loadStyles(<%= content %>); });"
  )
```
