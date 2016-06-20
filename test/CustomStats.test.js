'use strict';

var test = require('ava');
var CustomStats = require('..');
var baseCompilationOptions = require('./fixtures/compilationOptionsFixture').base;
var CompilationMock = require('./mocks/CompilationMock');

test('#getCustomStat()', function(t) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var expected = { 'leet.js': '123456' };
  var actual;

  customStats.addCustomStat('key', { 'leet.js': '123456' });

  actual = customStats.getCustomStat('key');

  t.deepEqual(actual, expected, 'should get a custom stat');
});

test('#getCustomStats()', function(t) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var actual = customStats.getCustomStats();
  var expected = {};

  t.deepEqual(actual, expected, 'should get empty custom stats');
});

test('#addCustomStat()', function(t) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var actual = customStats.addCustomStat('key', { test: 'ok' });
  var expected = { test: 'ok' };

  t.deepEqual(actual, expected,
    'should return a object, given (key, value)'
  );

  t.deepEqual(customStats.getCustomStats().key, expected,
    'should save the new custom stat'
  );
});

test('#replaceCustomStats()', function(t) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var expected = { test: 'ok' };

  t.deepEqual(customStats.getCustomStats(), {}, 'should have empty custom stats');

  customStats.replaceCustomStats(expected);

  t.deepEqual(customStats.getCustomStats(), expected, 'should replace custom stats');
});

test('#toJson()', function(t) {
  t.plan(2);

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
    var compilation = new CompilationMock(baseCompilationOptions);
    var customStats = new CustomStats(compilation);
    var expected = scenario.expected;
    var actual;

    customStatKeys.forEach(function(key) {
      var stat = scenario.customStats[key];

      customStats.addCustomStat(key, stat);
    });

    actual = customStats.toJson(jsonParams);

    customStatKeys.forEach(function(key) {
      t.deepEqual(actual[key], expected[key],
        'should include "' + key + '" in stats given (' + JSON.stringify(jsonParams) + ')'
      );
    });

    Object.keys(jsonParams).forEach(function(key) {
      t.deepEqual(actual[key], expected[key],
        'should not include "' + key + '" in stats given (' + JSON.stringify(jsonParams) + ')'
      );
    });
  });
});

test('#toJson() handles merging of existing CustomStats', function(t) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var stats = new CustomStats(compilation);
  var expected = {
    'leet.js': {
      integrity: 'blablabla',
      test: 'somevalue'
    }
  };
  var newStats;
  var actual;

  stats.addCustomStat('rails', {
    'leet.js': {
      integrity: 'blablabla'
    }
  });

  newStats = new CustomStats(compilation);
  newStats.addCustomStat('rails', {
    'leet.js': {
      test: 'somevalue'
    }
  });

  actual = compilation.getStats().toJson().rails;

  t.deepEqual(actual, expected);
});
