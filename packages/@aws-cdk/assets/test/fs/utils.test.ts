import * as fs from 'fs';
import * as path from 'path';
import { ImportMock } from 'ts-mock-imports';
import { FollowMode } from '../../lib/fs';
import * as util from '../../lib/fs/utils';

describe('shouldExclude', () => {
  test('excludes nothing by default', () => {
    testok(!util.shouldExclude([], path.join('some', 'file', 'path')));
  });

  test('excludes requested files', () => {
    const exclusions = ['*.ignored'];
    testok(util.shouldExclude(exclusions, path.join('some', 'file.ignored')));
    testok(!util.shouldExclude(exclusions, path.join('some', 'important', 'file')));
  });

  test('does not exclude whitelisted files', () => {
    const exclusions = ['*.ignored', '!important.*'];
    testok(!util.shouldExclude(exclusions, path.join('some', 'important.ignored')));
  });
});

describe('shouldFollow', () => {
  describe('always', () => {
    test('follows internal', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');

      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
      try {
        testok(util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('follows external', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
      try {
        testok(util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow internal when the referent does not exist', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
      try {
        testok(!util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow external when the referent does not exist', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
      try {
        testok(!util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });
  });

  describe('external', () => {
    test('does not follow internal', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
      try {
        testok(!util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.notCalled);
      } finally {
        mockFsExists.restore();
      }
    });

    test('follows external', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
      try {
        testok(util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow external when referent does not exist', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
      try {
        testok(!util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });
  });

  describe('blockExternal', () => {
    test('follows internal', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
      try {
        testok(util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow internal when referent does not exist', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
      try {
        testok(!util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.calledOnceWith(linkTarget));
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow external', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
      try {
        testok(!util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
        testok(mockFsExists.notCalled);
      } finally {
        mockFsExists.restore();
      }
    });
  });

  describe('never', () => {
    test('does not follow internal', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join(sourceRoot, 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
      try {
        testok(!util.shouldFollow(FollowMode.NEVER, sourceRoot, linkTarget));
        testok(mockFsExists.notCalled);
      } finally {
        mockFsExists.restore();
      }
    });

    test('does not follow external', () => {
      const sourceRoot = path.join('source', 'root');
      const linkTarget = path.join('alternate', 'referent');
      const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
      try {
        testok(!util.shouldFollow(FollowMode.NEVER, sourceRoot, linkTarget));
        testok(mockFsExists.notCalled);
      } finally {
        mockFsExists.restore();
      }
    });
  });
});

// Helper function to map Nodeunit-like assertion to Jest-like assertion
function testok(x: any) {
  expect(x).toBeTruthy();
}
