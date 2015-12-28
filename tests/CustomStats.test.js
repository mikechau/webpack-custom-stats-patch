'use strict';

var test = require('tape');
var CustomStats = require('..');
var baseCompilationOptions = require('./fixtures/compilationOptionsFixture').base;
var CompilationMock = require('./mocks/CompilationMock');

test('CustomStats#getCustomStat()', function(assert) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var expected = { 'leet.js': '123456' };
  var actual;

  customStats.addCustomStat('key', { 'leet.js': '123456' });

  actual = customStats.getCustomStat('key');

  assert.deepEqual(actual, expected, 'should get a custom stat');
  assert.end();
});

test('CustomStats#getCustomStats()', function(assert) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var actual = customStats.getCustomStats();
  var expected = {};

  assert.deepEqual(actual, expected, 'should get empty custom stats');

  assert.end();
});

test('CustomStats#addCustomStat()', function(assert) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var actual = customStats.addCustomStat('key', { test: 'ok' });
  var expected = { test: 'ok' };

  assert.deepEqual(actual, expected,
    'should return a object, given (key, value)'
  );

  assert.deepEqual(customStats.getCustomStats().key, expected,
    'should save the new custom stat'
  );

  assert.end();
});

test('CustomStats#replaceCustomStats()', function(assert) {
  var compilation = new CompilationMock(baseCompilationOptions);
  var customStats = new CustomStats(compilation);
  var expected = { test: 'ok' };

  assert.deepEqual(customStats.getCustomStats(), {}, 'should have empty custom stats');

  customStats.replaceCustomStats(expected);

  assert.deepEqual(customStats.getCustomStats(), expected, 'should replace custom stats');

  assert.end();
});

test('CustomStats#toJson()', function(assert) {
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
      assert.deepEqual(actual[key], expected[key],
        'should include "' + key + '" in stats given ' + '(' + JSON.stringify(jsonParams) + ')'
      );
    });

    Object.keys(jsonParams).forEach(function(key) {
      assert.deepEqual(actual[key], expected[key],
        'should not include "' + key + '" in stats given ' + '(' + JSON.stringify(jsonParams) + ')'
      );
    });
  });

  assert.end();
});

test('CustomStats#toJson() handles merging of existing CustomStats', function(assert) {
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

  assert.deepEqual(actual, expected);

  assert.end();
});
