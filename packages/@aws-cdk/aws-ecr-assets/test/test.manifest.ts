import { AssetIdentifier } from '@aws-cdk/assets';
import { Test } from 'nodeunit';
import { Manifest } from '../lib';

export = {
  'Type cast valid ManifestDockerImageEntry'(test: Test) {
    const input = {
      id: new AssetIdentifier('asset', 'dest'),
      type: 'docker-image',
      source: {
        directory: '.',
      },
      destination: {
        region: 'us-north-20',
        repositoryName: 'REPO',
        imageTag: 'TAG',
        imageUri: 'URI',
      },
    };

    test.ok(Manifest.isDockerImageEntry(input));
    test.done();
  },

  'Return false on non-dockerimage entry'(test: Test) {
    test.ok(!Manifest.isDockerImageEntry({
      id: new AssetIdentifier('asset', 'dest'),
      type: 'thing',
      source: {},
      destination: {},
    }));

    test.done();
  },

  'Throw on invalid ManifestDockerImageEntry'(test: Test) {
    const input = {
      id: new AssetIdentifier('asset', 'dest'),
      type: 'docker-image',
      source: {},
      destination: {},
    };

    test.throws(() => {
      Manifest.isDockerImageEntry(input);
    }, /Expected key 'directory' missing/);
    test.done();
  },
};