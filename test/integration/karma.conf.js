module.exports = {
  // base path, that will be used to resolve files and exclude
  basePath: '',


  // frameworks to use
  frameworks: ['mocha', 'chai', 'es5-shim'],


  // list of files / patterns to load in the browser
  files: [
    'test/integration/primus.js',
    'build/primus-reply-client.js',
    'test/integration/client.js',
    'test/integration/test.js'
  ],


  // list of files to exclude
  exclude: [
    
  ],


  // test results reporter to use
  // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
  reporters: ['progress'],


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: false,


  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera (has to be installed with `npm install karma-opera-launcher`)
  // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
  // - PhantomJS
  // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
  browsers: ['PhantomJS', 'Firefox'],


  // If browser does not capture in given timeout [ms], kill it
  captureTimeout: 5000,


  // Continuous Integration mode
  // if true, it capture browsers, run tests and exit
  singleRun: true
}