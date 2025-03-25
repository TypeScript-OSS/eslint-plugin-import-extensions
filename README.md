# eslint-plugin-import-extensions

TypeScript [doesn't transform extensions](https://github.com/microsoft/TypeScript/issues/16577) and [doesn't enforce file extensions](https://github.com/microsoft/TypeScript/issues/42813).

This is a simple eslint plugin that ensures that relative imports _and_ exports have extensions as desired (e.g. `.js`, `.ts`, `.cjs`, etc.). It also ensures that index files are explicitly imported.

This is a fork of [eslint-plugin-require-extensions](https://github.com/anza-xyz/eslint-plugin-require-extensions).

Credit for [the original implementation](https://github.com/solana-labs/wallet-adapter/pull/547) goes to [johnrees](https://github.com/johnrees). ❤️

## Install

```shell
npm install --save-dev eslint-plugin-require-extensions
```

## Edit `.eslintrc`

```json
{
    "extends": ["plugin:import-extensions/recommended"],
    "plugins": ["import-extensions"]
}
```

### Rules Configuration

The default `expectedExtensions` option is `['js']`, but you may override it and extensions will be used in priority order (most important first).

```json
{
    "rules": {
        "import-extensions/require-extensions": ["error", { "expectedExtensions": ["ts"] }],

        "import-extensions/require-index": ["error", { "expectedExtensions": ["ts"] }]
    }
}
```

## Code

```js
// source.js

import Target from './target';
```

## Lint

```shell
eslint .
```

```
source.js
  1:1  error  Relative imports and exports must end with .js  import-extensions/require-extensions
```

## Fix

```shell
eslint --fix .
```

```js
// source.js

import Target from './target.js';
```
