'use strict';

var Stats = require('webpack/lib/Stats');

function CompilationMock(options, customStats) {
  this.hash = options.hash;
  this.errors = options.errors;
  this.warnings = options.warnings;
  this.mainTemplate = options.mainTemplate;
  this.assets = options.assets;
  this.chunks = options.chunks;
  this.modules = options.modules;
  this.children = options.modules;
  this._customStats = customStats || {};
}

CompilationMock.prototype.getStats = function getStats() {
  if (this.customStats) {
    return this.customStats;
  }

  return new Stats(this);
};

module.exports = CompilationMock;
