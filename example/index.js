import 'foo';
import './foo.js';
import './foo.json';
// eslint-disable-next-line no-unused-vars
import json from './foo.json?raw';
// eslint-disable-next-line import-extensions/require-extensions, no-unused-vars
import queryNoExt from './foo?raw';
// eslint-disable-next-line import-extensions/require-extensions
import './foo';
// eslint-disable-next-line import-extensions/require-extensions
import './bar.json';
// eslint-disable-next-line import-extensions/require-index
import './dir';
