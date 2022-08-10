import fs from "fs";
import {xml2js} from "xml-js";

export class OffsetBuilder {

    public buildFurnitureOffset(assetName: string, outputPath: string) {
        return new Promise<void>(async resolve => {
            let assetsXml: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}_assets.xml`);
            assetsXml = xml2js(assetsXml, {compact: false});
            let spritesheet: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}.json`);
            spritesheet = JSON.parse(spritesheet);

            if (spritesheet?.meta?.image) {
                spritesheet.meta.image = `${assetName}.png`;
            }

            let modifiedAssets: {}[] = [];

            assetsXml.elements[0]?.elements.forEach((asset) => {
                const name: string = asset.attributes.name;

                try {
                    if (spritesheet.frames[asset.attributes.name] !== undefined) {
                        const {spriteSourceSize} = spritesheet.frames[asset.attributes.name];
                        /*spriteSourceSize.x = asset.attributes.flipH === undefined ? -parseInt(asset.attributes.x) : -(parseInt(spriteSourceSize.w) - parseInt(asset.attributes.x));
                        spriteSourceSize.y = -parseInt(asset.attributes.y);*/
                        spriteSourceSize.x = -parseInt(asset.attributes.x);
                        spriteSourceSize.y = -parseInt(asset.attributes.y);
                        spritesheet.frames[asset.attributes.name] = asset.attributes.flipH === undefined;
                        modifiedAssets.push(asset);
                    } else {
                        spritesheet.frames[asset.attributes.name] = {
                            "frame": {
                                "x": spritesheet.frames[asset.attributes.source].frame.x,
                                "y": spritesheet.frames[asset.attributes.source].frame.y,
                                "w": spritesheet.frames[asset.attributes.source].frame.w,
                                "h": spritesheet.frames[asset.attributes.source].frame.h
                            },
                            "sourceSize": {
                                "w": spritesheet.frames[asset.attributes.source].sourceSize.w,
                                "h": spritesheet.frames[asset.attributes.source].sourceSize.h
                            },
                            "spriteSourceSize": {
                                "x": modifiedAssets.includes(asset) ? spritesheet.frames[asset.attributes.source].spriteSourceSize.x : -parseInt(asset.attributes.x),
                                "y": modifiedAssets.includes(asset) ? spritesheet.frames[asset.attributes.source].spriteSourceSize.y : -parseInt(asset.attributes.y),
                                "w": spritesheet.frames[asset.attributes.source].spriteSourceSize.w,
                                "h": spritesheet.frames[asset.attributes.source].spriteSourceSize.h
                            },
                            "rotated": false,
                            "trimmed": true,
                            "flipH": asset.attributes.flipH !== undefined
                        }
                        modifiedAssets.push(asset);
                    }
                } catch (e) {
                    const splittedName: string[] = name.split("_");
                    if(splittedName[splittedName.length - 4] !== "32") {
                        console.log("\x1b[0m", ">>", "\x1b[31m", `Error finding frame ${name}`, "\x1b[0m");
                    }
                }
            });
            fs.writeFile(`${outputPath}/${assetName}/${assetName}.json`, JSON.stringify(spritesheet), () => {
                resolve();
            });
        });
    }

}