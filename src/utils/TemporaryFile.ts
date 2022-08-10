import fs from "fs";

export function deleteFurniFile(assetName: string, outputPath: string): Promise<void> {
    return new Promise<void>(resolve => {
        fs.rm(`${outputPath}/${assetName}/sprites/`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/${assetName}_assets.xml`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/${assetName}_logic.xml`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/${assetName}_visualization.xml`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/index.xml`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/manifest.xml`, {recursive: true}, () => {});
        resolve();
    });
}