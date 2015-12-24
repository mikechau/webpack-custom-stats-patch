# webpack-custom-stats-patch

This module provides a patched copy of webpack's `Stats` prototype, it extends
it to allow you to inject your own custom attributes.

This could be useful when you are writing webpack plugins that generate a
specific set of information that you would to pass down to your stat plugins
that could be generating things like asset manifests.

For example, you may be writing a webpack plugin to generate subresource
integrity hashes that get saved into some mapping into webpack's `compilation`,
but your stats plugin has no way of retrieving the mapping because
`stats.toJSON()` returns only a specific set of the `compilation` by default[1].

## Install

```
npm install webpack-custom-stats-patch --save-dev
```

## Usage

```
var CustomStats = require('webpakc-custom-stats-patch');

var customStats = new CustomStats(compiliation);

// Add a custom stat
customStats.addCustomStat('sris', { 'main-123456789.js': 'sha512-9000' });

// Now when `stats.toJson()` is called in your stats plugins, the custom stat
/ is available
customStats.toJson().sris // => { 'main-123456789.js': 'sha512-9000' });

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

[@IngwiePhoenix](https://github.com/IngwiePhoenix)
[Webpack Gitter](https://gitter.im/webpack/webpack)

## References

[1]: https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions "webpack stats.toJson()"
