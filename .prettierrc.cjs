module.exports = {
  // Formatting rules
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,

  // JSX specific
  jsxSingleQuote: true,
  bracketSameLine: false,

  // Other formatting
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',

  // File overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
