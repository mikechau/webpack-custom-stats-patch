'use strict';

var baseOptions = {
  hash: '1337',
  errors: [],
  warnings: [],
  mainTemplate: {
    getPublicPath: function() {
      return 'test';
    }
  },
  assets: {
    test: {
      size: function() {
        return 9001;
      }
    }
  },
  chunks: [],
  modules: [],
  children: []
};

module.exports = {
  base: baseOptions
};
