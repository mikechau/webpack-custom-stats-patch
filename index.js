'use strict';

var Stats = require('webpack/lib/Stats');
var isPlainObject = require('./lib/utils/isPlainObject');

function CustomStats(compilation) {
  Stats.apply(this, arguments);
  this._customStats = {};
};

CustomStats.prototype = Object.create(Stats.prototype);

CustomStats.prototype.constructor = CustomStats;

CustomStats.prototype.getCustomStats = function getCustomStats() {
  return this._customStats;
};

CustomStats.prototype.addCustomStat = function addCustomStat(key, value) {
  var stat = {};

  stat[key] = value;

  this._customStats[key] = value;

  return stat;
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
