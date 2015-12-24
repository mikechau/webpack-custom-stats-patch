'use strict';

var test = require('tape');
var CustomStats = require('..');

test('CustomStats#getCustomStats()', function(assert) {
  var customStats = new CustomStats({});
  var actual = customStats.getCustomStats();
  var expected = {};

  assert.deepEqual(actual, expected, 'should get empty custom stats');
  assert.end();
});

test('CustomStats#addCustomStat()', function(assert) {
  var customStats = new CustomStats({});
  var actual = customStats.addCustomStat('key', { test: 'ok' });
  var expected = { key: { test: 'ok' } };

  assert.deepEqual(actual, expected, 'should return a object, given (key, value)');
  assert.deepEqual(customStats.getCustomStats(), expected, 'should save the new custom stat');

  assert.end();
});

test('CustomStats#replaceCustomStats()', function(assert) {
  var customStats = new CustomStats({});
  var expected = { test: 'ok' };

  assert.deepEqual(customStats.getCustomStats(), {}, 'should have empty custom stats');

  customStats.replaceCustomStats(expected);

  assert.deepEqual(customStats.getCustomStats(), expected, 'should replace custom stats');

  assert.end();
});

test('CustomStats#toJson()', function(assert) {
  var compiliation = {
    hash: '1337',
    errors: [],
    warnings: [],
    mainTemplate: {
      getPublicPath: function() { return 'test'; }
    },
    assets: {
      test: {
        size: function() { return 9001; }
      }
    },
    chunks: [],
    modules: [],
    children: []
  };

  assert.plan(2);

  [
    {
      params: {},
      expected: {
        sris: {
          'leet.js': 'sha9001-1337'
        }
      },
      customStats: {
        sris: {
          'leet.js': 'sha9001-1337'
        }
      }
    },
    {
      params: {
        sris: false
      },
      expected: {
        sris: undefined
      },
      customStats: {}
    }
  ].forEach(function(scenario) {
    var customStatKeys = Object.keys(scenario.customStats);
    var jsonParams = scenario.params;
    var customStats = new CustomStats(compiliation);
    var expected = scenario.expected;
    var actual;

    customStatKeys.forEach(function(key) {
      var stat = scenario.customStats[key];

      customStats.addCustomStat(key, stat);
    });

    actual = customStats.toJson(jsonParams);

    customStatKeys.forEach(function(key) {
      assert.deepEqual(actual[key], expected[key], 'should include "' + key + '" in stats given ' + '(' + JSON.stringify(jsonParams) + ')');
    });

    Object.keys(jsonParams).forEach(function(key) {
      assert.deepEqual(actual[key], expected[key], 'should not include "' + key + '" in stats given ' + '(' + JSON.stringify(jsonParams) + ')');
    });
  });

  assert.end();
});
