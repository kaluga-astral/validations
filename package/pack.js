const path = require('path');

const { buildTs, rmDist, copy } = require('@astral/pack');

rmDist();

buildTs({
  releaseTag: process.env.RELEASE_TAG,
});

copy({
  sourcesDirPath: path.resolve('..'),
  targetPath: '.',
  files: ['README.md'],
});
