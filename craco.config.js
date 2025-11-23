const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@features/(.*)$': '<rootDir>/src/features/$1'
      }
    }
  }
};