const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1'
      }
    }
  }
};