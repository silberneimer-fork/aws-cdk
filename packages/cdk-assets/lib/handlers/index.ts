import { AssetManifest, ManifestEntry } from "@aws-cdk/assets";
import * as ecrAsset from '@aws-cdk/aws-ecr-assets';
import * as s3Asset from '@aws-cdk/aws-s3-assets';
import { IAws } from "../aws-operations";
import { IAssetHandler, MessageSink } from "../private/asset-handler";
import { ContainerImageAssetHandler } from "./container-images";
import { FileAssetHandler } from "./files";

export function makeAssetHandler(manifest: AssetManifest, asset: ManifestEntry, aws: IAws, message: MessageSink): IAssetHandler {
  if (s3Asset.Manifest.isFileEntry(asset)) {
    return new FileAssetHandler(manifest.directory, asset, aws, message);
  }
  if (ecrAsset.Manifest.isDockerImageEntry(asset)) {
    return new ContainerImageAssetHandler(manifest.directory, asset, aws, message);
  }

  throw new Error(`Unrecognized asset type '${asset.type}' in ${JSON.stringify(asset)})`);
}