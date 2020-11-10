module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '\\.test\\.ts$',
  coverageDirectory: '../coverage',
  collectCoverageFrom: [ '**/*.ts' ]
};
