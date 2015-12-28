'use strict';

var Stats = require('webpack/lib/Stats');
var isPlainObject = require('./lib/utils/isPlainObject');
var _merge = require('lodash.merge');

function CustomStats(compilation) {
  var self = this;
  var currentStats = compilation.getStats();
  var statsClassName = currentStats.constructor.name;

  Stats.apply(this, arguments);

  if (statsClassName === 'CustomStats' && (typeof currentStats.getCustomStats === 'function')) {
    this._customStats = _merge({}, currentStats.getCustomStats());
  } else {
    this._customStats = {};
  }

  compilation.getStats = function getStats() {
    return self;
  };

  compilation.__CUSTOM_STATS = this._customStats;
};

CustomStats.prototype = Object.create(Stats.prototype);

CustomStats.prototype.constructor = CustomStats;

CustomStats.prototype.getCustomStat = function getCustomStat(key) {
  return this._customStats[key];
};

CustomStats.prototype.getCustomStats = function getCustomStats() {
  return this._customStats;
};

CustomStats.prototype.addCustomStat = function addCustomStat(key, value) {
  var currentStatValue = this._customStats[key];

  this._customStats[key] = _merge({}, currentStatValue, value);

  return this._customStats[key];
};

CustomStats.prototype.replaceCustomStats = function replaceCustomStats(obj) {
  if (obj && isPlainObject(obj)) {
    this._customStats = obj;
  }

  return this._customStats;
};

CustomStats.prototype.toJson = function toJson(options, forToString) {
  var self = this;
  var params = options || {};
  var stats = Stats.prototype.toJson.apply(self, arguments);
  var customStats;

  if (forToString) {
    return stats;
  }

  function allowCustomStat(key) {
    return params[key] === undefined ? true : params[key];
  }

  customStats = self._customStats;

  Object.keys(customStats).forEach(function(customStatKey) {
    if (allowCustomStat(customStatKey)) {
      stats[customStatKey] = customStats[customStatKey];
    }
  });

  return stats;
};

module.exports = CustomStats;
