import fs from "fs";
import {xml2js} from "xml-js";

export class OffsetBuilder {

    public buildFurnitureOffset(assetName: string, outputPath: string) {
        return new Promise<void>(async resolve => {
            let assetsXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_${assetName}_assets.bin`);
            assetsXml = xml2js(assetsXml, {compact: false});
            let spritesheet: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}.json`);
            spritesheet = JSON.parse(spritesheet);

            if (spritesheet?.meta?.image) {
                spritesheet.meta.image = `${assetName}.png`;
            }

            let modifiedAssets: {}[] = [];
            let sourceAssets: any[] = [];

            assetsXml.elements[0]?.elements.forEach((asset) => {
                if(asset.attributes !== undefined) {
                    const name: string = asset.attributes.name;

                    try {
                        const splittedName: string[] = asset.attributes.name.split("_");
                        splittedName.splice(splittedName.length - 4, 4);
                        const className = splittedName.join("_");
                        if (spritesheet.frames[className + "_" + asset.attributes.name] !== undefined) {
                            const {spriteSourceSize} = spritesheet.frames[className + "_" + asset.attributes.name];
                            spriteSourceSize.x = -parseInt(asset.attributes.x);
                            spriteSourceSize.y = -parseInt(asset.attributes.y);
                            spritesheet.frames[className + "_" + asset.attributes.name].flipH = asset.attributes.flipH !== undefined;
                            modifiedAssets.push(asset);
                        } else if(asset.attributes.source !== undefined) {
                            sourceAssets.push(asset);
                        }
                    } catch (e) {
                        console.log(e);
                        const splittedName: string[] = name.split("_");
                        if (splittedName[splittedName.length - 4] !== "32") {
                            console.log("\x1b[0m", ">>", "\x1b[31m", `Error finding frame ${name}`, "\x1b[0m");
                        }
                    }
                }
            });
            sourceAssets.forEach((asset) => {
                try {
                    const splittedName: string[] = asset.attributes.name.split("_");
                    splittedName.splice(splittedName.length - 4, 4);
                    const className = splittedName.join("_");

                    spritesheet.frames[className + "_" + asset.attributes.name] = {
                        "frame": {
                            "x": spritesheet.frames[className + "_" + asset.attributes.source].frame.x,
                            "y": spritesheet.frames[className + "_" + asset.attributes.source].frame.y,
                            "w": spritesheet.frames[className + "_" + asset.attributes.source].frame.w,
                            "h": spritesheet.frames[className + "_" + asset.attributes.source].frame.h
                        },
                        "sourceSize": {
                            "w": spritesheet.frames[className + "_" + asset.attributes.source].sourceSize.w,
                            "h": spritesheet.frames[className + "_" + asset.attributes.source].sourceSize.h
                        },
                        "spriteSourceSize": {
                            "x": -parseInt(asset.attributes.x),
                            "y": -parseInt(asset.attributes.y),
                            "w": spritesheet.frames[className + "_" + asset.attributes.source].spriteSourceSize.w,
                            "h": spritesheet.frames[className + "_" + asset.attributes.source].spriteSourceSize.h
                        },
                        "rotated": false,
                        "trimmed": true,
                        "flipH": asset.attributes.flipH !== undefined
                    }
                    modifiedAssets.push(asset);
                }catch (e) {

                }
            });

            fs.writeFile(`${outputPath}/${assetName}/${assetName}.json`, JSON.stringify(spritesheet), () => {
                resolve();
            });
        });
    }

    public buildEffectOffset(assetName: string, outputPath: string) {
        return new Promise<void>(async resolve => {
            let assetsXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_manifest.bin`);
            assetsXml = xml2js(assetsXml, {compact: false});
            let spritesheet: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}.json`);
            spritesheet = JSON.parse(spritesheet);

            if (spritesheet?.meta?.image) {
                spritesheet.meta.image = `${assetName}.png`;
            }

            let modifiedAssets: {}[] = [];
            let sourceAssets: any[] = [];

            assetsXml.elements[0]?.elements[0]?.elements[0]?.elements.forEach((asset) => {
                asset.elements.forEach(param  => {
                    if(param.attributes !== undefined && param.attributes.key === 'offset') {
                        const name: string = assetsXml.elements[0]?.elements[0].attributes.id + "_" + asset.attributes.name;
                        const offsetX: number = Number(param.attributes.value.split(",")[0]);
                        const offsetY: number = Number(param.attributes.value.split(",")[1]);
                        //console.log(name, offsetX, offsetY);
                        if (spritesheet.frames[name] !== undefined) {
                            const {spriteSourceSize} = spritesheet.frames[name];
                            spriteSourceSize.x = offsetX;
                            spriteSourceSize.y = offsetY;
                        } else {
                            console.log("SOOOOOOOOOON")
                        }
                    }
                });
                /*if(asset.attributes !== undefined) {
                    const name: string = asset.attributes.name;

                    try {
                        const splittedName: string[] = asset.attributes.name.split("_");
                        splittedName.splice(splittedName.length - 4, 4);
                        const className = splittedName.join("_");
                        if (spritesheet.frames[className + "_" + asset.attributes.name] !== undefined) {
                            const {spriteSourceSize} = spritesheet.frames[className + "_" + asset.attributes.name];
                            spriteSourceSize.x = -parseInt(asset.attributes.x);
                            spriteSourceSize.y = -parseInt(asset.attributes.y);
                            spritesheet.frames[className + "_" + asset.attributes.name].flipH = asset.attributes.flipH !== undefined;
                            modifiedAssets.push(asset);
                        } else if(asset.attributes.source !== undefined) {
                            sourceAssets.push(asset);
                        }
                    } catch (e) {
                        console.log(e);
                        const splittedName: string[] = name.split("_");
                        if (splittedName[splittedName.length - 4] !== "32") {
                            console.log("\x1b[0m", ">>", "\x1b[31m", `Error finding frame ${name}`, "\x1b[0m");
                        }
                    }
                }*/
            });

            fs.writeFile(`${outputPath}/${assetName}/${assetName}.json`, JSON.stringify(spritesheet), () => {
                resolve();
            });
        });
    }

}