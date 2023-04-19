const { buildTs, rmDist } = require('@astral/pack');

rmDist();

buildTs({
  releaseTag: process.env.RELEASE_TAG,
});
