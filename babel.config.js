module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],      // or 'module:metro-react-native-babel-preset'
    plugins: [
      // other plugins you need,
      'react-native-reanimated/plugin'   // ← must be last
    ],
  };
}; 
