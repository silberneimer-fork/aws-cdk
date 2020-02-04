import { AssetIdentifier, ManifestEntry } from "@aws-cdk/assets";

const FILE_ASSET_TYPE = 'file';

/**
 * Packaging strategy for file assets
 */
export enum FileAssetPackaging {
  /**
   * Upload the given path as a file
   */
  FILE = 'file',

  /**
   * The given path is a directory, zip it and upload
   */
  ZIP_DIRECTORY = 'zip',
}

/**
 * A manifest entry for a file asset
 */
export interface ManifestFileEntry {
  /**
   * Identifier for this asset
   */
  readonly id: AssetIdentifier;

  /**
   * Type of this manifest entry
   */
  readonly type: 'file';

  /**
   * Source of the file asset
   */
  readonly source: FileSource;

  /**
   * Destination for the file asset
   */
  readonly destination: FileDestination;
}

/**
 * Static class so that this is accessible via JSII
 */
export class Manifest {
  /**
   * Return whether the given manifest entry is for a file asset
   *
   * Will throw if the manifest entry is for a file asset but malformed.
   */
  public static isFileEntry(entry: ManifestEntry): entry is ManifestFileEntry {
    if (entry.type !== FILE_ASSET_TYPE) { return false; }

    expectKey(entry.source, 'path', 'string');
    expectKey(entry.source, 'packaging', 'string', true);
    expectKey(entry.destination, 'region', 'string');
    expectKey(entry.destination, 'assumeRoleArn', 'string', true);
    expectKey(entry.destination, 'assumeRoleExternalId', 'string', true);
    expectKey(entry.destination, 'bucketName', 'string');
    expectKey(entry.destination, 'objectKey', 'string');

    return true;
  }
}

/**
 * Describe the source of a file asset
 */
export interface FileSource {
  /**
   * The filesystem object to upload
   */
  readonly path: string;

  /**
   * Packaging method
   *
   * @default FILE
   */
  readonly packaging?: FileAssetPackaging;
}

/**
 * Where in S3 a file asset needs to be published
 */
export interface FileDestination {
  /**
   * The region where this asset will need to be published
   */
  readonly region: string;

  /**
   * The role that needs to be assumed while publishing this asset
   *
   * @default - No role will be assumed
   */
  readonly assumeRoleArn?: string;

  /**
   * The ExternalId that needs to be supplied while assuming this role
   *
   * @default - No ExternalId will be supplied
   */
  readonly assumeRoleExternalId?: string;

  /**
   * The name of the bucket
   */
  readonly bucketName: string;

  /**
   * The destination object key
   */
  readonly objectKey: string;
}

function expectKey(obj: any, key: string, type: string, optional?: boolean) {
  if (typeof obj !== 'object' || obj === null || (!(key in obj) && !optional)) {
    throw new Error(`Expected key '${key}' missing: ${JSON.stringify(obj)}`);
  }
  if (key in obj && typeof obj[key] !== type) {
    throw new Error(`Expected type of key '${key}' to be '${type}': got '${typeof obj[key]}'`);
  }
}