// https://github.com/Nikku/karma-browserify
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    // browsers: ['PhantomJS', 'Chrome'],
    frameworks: ['browserify', 'jasmine'],
    files: ['test/**/*.js'],
    reporters: ['spec'],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      // needed to enable mocks
      plugin: [require('proxyquireify').plugin]
    },
    // if you want to continuously re-run tests on file-save,
    // replace the following line with `autoWatch: true`
    singleRun: true
  })
}
