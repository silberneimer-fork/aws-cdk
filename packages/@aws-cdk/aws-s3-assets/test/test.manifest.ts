import { AssetIdentifier } from '@aws-cdk/assets';
import { Test } from 'nodeunit';
import { Manifest } from '../lib';

export = {
  'Type cast valid ManifestFileEntry'(test: Test) {
    const input = {
      id: new AssetIdentifier('asset', 'dest'),
      type: 'file',
      source: {
        path: 'a/b/c',
      },
      destination: {
        region: 'us-north-20',
        bucketName: 'Bouquet',
        objectKey: 'key',
      },
    };

    test.ok(Manifest.isFileEntry(input));
    test.done();
  },

  'Return false on non-file entry'(test: Test) {
    test.ok(!Manifest.isFileEntry({
      id: new AssetIdentifier('asset', 'dest'),
      type: 'thing',
      source: {},
      destination: {},
    }));

    test.done();
  },

  'Throw on invalid ManifestFileEntry'(test: Test) {
    const input = {
      id: new AssetIdentifier('asset', 'dest'),
      type: 'file',
      source: {},
      destination: {},
    };

    test.throws(() => {
      Manifest.isFileEntry(input);
    }, /Expected key 'path' missing/);
    test.done();
  },
};