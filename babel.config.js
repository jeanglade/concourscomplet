module.exports = {};

const path = require('path');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            _config: path.resolve(__dirname, 'src/config/'),
            _icons: path.resolve(__dirname, 'src/icons/'),
            _screens: path.resolve(__dirname, 'src/screens/'),
            _navigation: path.resolve(__dirname, 'src/navigation/'),
            _components: path.resolve(__dirname, 'src/components/'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
