import fs from "fs";

export function deleteFurniFile(assetName: string, outputPath: string): Promise<void> {
    return new Promise<void>(resolve => {
        fs.rm(`${outputPath}/${assetName}/sprites/`, {recursive: true}, () => {});
        fs.rm(`${outputPath}/${assetName}/binaries/`, {recursive: true}, () => {});
        resolve();
    });
}