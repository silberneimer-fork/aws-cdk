jest.mock('aws-sdk');
import * as AWS from 'aws-sdk';

export function mockAws() {
  return {
    currentAccount: jest.fn(() => Promise.resolve('current_account')),
    defaultRegion: jest.fn(() => Promise.resolve('current_region')),
    ecrClient: jest.fn(() => new AWS.ECR()),
    s3Client: jest.fn(() => new AWS.S3()),
  };
}