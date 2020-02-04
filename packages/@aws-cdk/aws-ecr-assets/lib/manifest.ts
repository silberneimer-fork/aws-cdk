import { AssetIdentifier, ManifestEntry } from "@aws-cdk/assets";

const DOCKER_IMAGE_ASSET_TYPE = 'docker-image';

/**
 * A manifest entry for a file asset
 */
export interface ManifestDockerImageEntry {
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
  readonly source: DockerImageSource;

  /**
   * Destination for the file asset
   */
  readonly destination: DockerImageDestination;
}

/**
 * Static class so that this is accessible via JSII
 */
export class Manifest {
  /**
   * Return whether the given manifest entry is for a docker image asset
   *
   * Will throw if the manifest entry is for a file asset but malformed.
   */
  public static isDockerImageEntry(entry: ManifestEntry): entry is ManifestDockerImageEntry {
    if (entry.type !== DOCKER_IMAGE_ASSET_TYPE) { return false; }

    expectKey(entry.source, 'directory', 'string');
    expectKey(entry.source, 'dockerFile', 'string', true);
    expectKey(entry.source, 'dockerBuildTarget', 'string', true);
    expectKey(entry.source, 'dockerBuildArgs', 'object', true);
    for (const value of Object.values(entry.source.dockerBuildArgs || {})) {
      if (typeof value !== 'string') {
        throw new Error(`All elements of 'dockerBuildArgs' should be strings, got: '${value}'`);
      }
    }

    expectKey(entry.destination, 'region', 'string');
    expectKey(entry.destination, 'assumeRoleArn', 'string', true);
    expectKey(entry.destination, 'assumeRoleExternalId', 'string', true);
    expectKey(entry.destination, 'repositoryName', 'string');
    expectKey(entry.destination, 'imageTag', 'string');
    expectKey(entry.destination, 'imageUri', 'string');

    return true;
  }
}

/**
 * Properties for how to produce a Docker image from a source
 */
export interface DockerImageSource {
  /**
   * The directory containing the Docker image build instructions
   */
  readonly directory: string;

  /**
   * The name of the file with build instructions
   *
   * @default "Dockerfile"
   */
  readonly dockerFile?: string;

  /**
   * Target build stage in a Dockerfile with multiple build stages
   *
   * @default - The last stage in the Dockerfile
   */
  readonly dockerBuildTarget?: string;

  /**
   * Additional build arguments
   *
   * @default - No additional build arguments
   */
  readonly dockerBuildArgs?: Record<string, string>;
}

/**
 * Where to publish docker images
 */
export interface DockerImageDestination {
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
   * Name of the ECR repository to publish to
   */
  readonly repositoryName: string;

  /**
   * Tag of the image to publish
   */
  readonly imageTag: string;

  /**
   * Full Docker tag coordinates (registry and repository and tag)
   *
   * Example:
   *
   * ```
   * 1234.dkr.ecr.REGION.amazonaws.com/REPO:TAG
   * ```
   */
  readonly imageUri: string;
}

function expectKey(obj: any, key: string, type: string, optional?: boolean) {
  if (typeof obj !== 'object' || obj === null || (!(key in obj) && !optional)) {
    throw new Error(`Expected key '${key}' missing: ${JSON.stringify(obj)}`);
  }
  if (key in obj && typeof obj[key] !== type) {
    throw new Error(`Expected type of key '${key}' to be '${type}': got '${typeof obj[key]}'`);
  }
}