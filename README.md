# webpack-custom-stats-patch

[![npm version](https://badge.fury.io/js/webpack-custom-stats-patch.svg)](https://badge.fury.io/js/webpack-custom-stats-patch) [![Build Status](https://travis-ci.org/mikechau/webpack-custom-stats-patch.svg?branch=master)](https://travis-ci.org/mikechau/webpack-custom-stats-patch) [![Dependency Status](https://david-dm.org/mikechau/webpack-custom-stats-patch.svg)](https://david-dm.org/mikechau/webpack-custom-stats-patch) [![devDependency Status](https://david-dm.org/mikechau/webpack-custom-stats-patch/dev-status.svg)](https://david-dm.org/mikechau/webpack-custom-stats-patch#info=devDependencies)

This module provides a patched copy of webpack's `Stats` prototype, it extends
it to allow you to inject your own custom attributes.

This could be useful when you are writing webpack plugins that generate a
specific set of information that you would to pass down to your stat plugins
that could be generating things like asset manifests.

For example, you may be writing a webpack plugin to generate subresource
integrity hashes that get saved into some mapping into webpack's `compilation`,
but your stats plugin has no way of retrieving the mapping because
`stats.toJSON()` returns only a specific set of the `compilation` by default [[1]].

This plugin patches `compilation.getStats()` and `stats.toJson()`.

You can also reference your custom stats via `compilation.__CUSTOM_STATS`.

## Install

```
npm install webpack-custom-stats-patch --save-dev
```

## Usage

```js
var CustomStats = require('webpack-custom-stats-patch');

var customStats = new CustomStats(compilation);

// Add a custom stat
customStats.addCustomStat('sris', { 'main-123456789.js': 'sha512-9000' });

// Now when `stats.toJson()` is called in your stats plugins, the custom stat
// is available
customStats.toJson().sris
// # => { 'main-123456789.js': 'sha512-9000' });

// You can also view the custom stats directly in compilation
compilation.__CUSTOM_STATS
// # => {
//    sris: {
//      'main-123456789': 'sha512-9000'
//    }
// };

// Replace custom stats in its entirety
// Pass in a plain object
customStats.replaceCustomStats({
  sris: {
    ...
  },

  rails: {
    ...
  }
});
```

## Special Thanks

- [@IngwiePhoenix](https://github.com/IngwiePhoenix)
- [Webpack Gitter](https://gitter.im/webpack/webpack)

## LICENSE
MIT.

[1]: https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions "webpack stats.toJson()"
