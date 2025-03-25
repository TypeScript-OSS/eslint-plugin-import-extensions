const { existsSync, lstatSync } = require('fs');
const { dirname, resolve } = require('path');

const defaultExpectedExtensions = ['js'];

const makeReadableOptions = (options) => {
  if (options.length === 1) {
    return options[0];
  } else if (options.length === 2) {
    return `${options[0]} or ${options[1]}`;
  } else {
    return `one of: ${options.join(', ')}`;
  }
};

module.exports = {
  configs: {
    recommended: {
      plugins: ['import-extensions'],
      rules: {
        'import-extensions/require-extensions': 'error',
        'import-extensions/require-index': 'error'
      }
    }
  },
  rules: {
    'require-extensions': rule((context, node, path) => {
      const expectedExtensions = context.options[0]?.expectedExtensions ?? defaultExpectedExtensions;

      if (expectedExtensions.length > 0 && !existsSync(path)) {
        let fix;
        if (!node.source.value.includes('?')) {
          fix = (fixer) => {
            // Trying to find the first existing file with one of the expected extensions
            for (const extension of expectedExtensions) {
              if (existsSync(`${path}.${extension}`)) {
                return fixer.replaceText(node.source, `'${node.source.value}.${extension}'`);
              }
            }

            // Otherwise, using the first expected extension
            return fixer.replaceText(node.source, `'${node.source.value}.${expectedExtensions[0]}'`);
          };
        }

        const expectedPatterns = expectedExtensions.map((ext) => `.${ext}`);
        context.report({
          node,
          message: `Relative imports and exports must end with ${makeReadableOptions(expectedPatterns)}`,
          fix
        });
      }
    }),
    'require-index': rule((context, node, path) => {
      const expectedExtensions = context.options[0]?.expectedExtensions ?? defaultExpectedExtensions;

      if (expectedExtensions.length > 0 && existsSync(path) && lstatSync(path).isDirectory()) {
        const expectedPatterns = expectedExtensions.map((ext) => `index.${ext}`);
        context.report({
          node,
          message: `Directory paths must end with ${makeReadableOptions(expectedPatterns)}`,
          fix(fixer) {
            // Trying to find the first existing file with one of the expected extensions
            for (const extension of expectedExtensions) {
              if (existsSync(`${path}/index.${extension}`)) {
                return fixer.replaceText(node.source, `'${node.source.value}/index.${extension}'`);
              }
            }

            // Otherwise, using the first expected extension
            return fixer.replaceText(node.source, `'${node.source.value}/index.${expectedExtensions[0]}'`);
          }
        });
      }
    })
  }
};

function rule(check) {
  return {
    meta: {
      fixable: true,
      schema: [
        {
          type: 'object',
          properties: {
            expectedExtensions: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          additionalProperties: false
        }
      ]
    },
    create(context) {
      const expectedExtensions = context.options[0]?.expectedExtensions ?? defaultExpectedExtensions;

      function rule(node) {
        const source = node.source;
        if (!source) return;
        const value = source.value.replace(/\?.*$/, '');
        if (!value || !value.startsWith('.') || expectedExtensions.find((ext) => value.endsWith(`.${ext}`)) !== undefined) return;

        check(context, node, resolve(dirname(context.getFilename()), value));
      }

      return {
        DeclareExportDeclaration: rule,
        DeclareExportAllDeclaration: rule,
        ExportAllDeclaration: rule,
        ExportNamedDeclaration: rule,
        ImportDeclaration: rule
      };
    }
  };
}
