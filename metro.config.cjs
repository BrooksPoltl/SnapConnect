/* eslint-env node */
/* eslint-disable no-undef */
const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .mjs and .cjs files
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');

// Package exports are enabled by default in SDK 53, but we can disable if needed
// config.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(config);
