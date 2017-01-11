/* eslint-disable no-underscore-dangle */

'use strict';

var Stats = require('webpack/lib/Stats');
var isPlainObject = require('./lib/utils/isPlainObject');
var _merge = require('lodash.merge');

class CustomStats extends Stats {
  constructor(compilation) {
    var currentStats = compilation.getStats();
    var statsClassName = currentStats.constructor.name;

    super(compilation);

    if (statsClassName === 'CustomStats' && (typeof currentStats.getCustomStats === 'function')) {
      this._customStats = _merge({}, currentStats.getCustomStats());
    } else {
      this._customStats = {};
    }

    /* eslint-disable no-param-reassign */
    compilation.getStats = () => this;

    compilation.__CUSTOM_STATS = this._customStats;
    /* eslint-enable no-param-reassign */
  }

  getCustomStat(key) {
    return this._customStats[key];
  }

  getCustomStats() {
    return this._customStats;
  }

  addCustomStat(key, value) {
    var currentStatValue = this._customStats[key];

    this._customStats[key] = _merge({}, currentStatValue, value);

    return this._customStats[key];
  }

  replaceCustomStats(obj) {
    if (obj && isPlainObject(obj)) {
      this._customStats = obj;
    }

    return this._customStats;
  }

  toJson(options, forToString) {
    var self = this;
    var params = options || {};
    var stats = Stats.prototype.toJson.apply(self, arguments);
    var customStats = self._customStats;

    if (forToString) {
      return stats;
    }

    function allowCustomStat(key) {
      return params[key] === undefined ? true : params[key];
    }

    Object.keys(customStats).forEach(function addStats(customStatKey) {
      if (allowCustomStat(customStatKey)) {
        stats[customStatKey] = customStats[customStatKey];
      }
    });

    return stats;
  }
}

module.exports = CustomStats;
