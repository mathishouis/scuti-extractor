import fs from "fs";
import {xml2js} from "xml-js";

export class AnimationBuilder {

    public buildEffectAnimation(assetName: string, outputPath: string) {
        return new Promise<void>(async resolve => {
            let animationXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_animation.bin`);
            animationXml = xml2js(animationXml, {compact: false});
            let spritesheet: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}.json`);
            spritesheet = JSON.parse(spritesheet);

            spritesheet.animations = {};

            animationXml.elements.forEach((animation) => {
                let name = animation.attributes.name;
                let desc = animation.attributes.desc;

                spritesheet.animations[name] = {};
                spritesheet.animations[name].desc = desc;

                animation.elements.forEach((element) => {
                    switch (element.name) {
                        case "sprite":
                            if(!spritesheet.animations[name].sprites) spritesheet.animations[name].sprites = {};
                            spritesheet.animations[name].sprites[element.attributes.id] = element.attributes;
                            if(element.attributes.directions === "1") {
                                spritesheet.animations[name].sprites[element.attributes.id].directions = {};
                                element.elements.forEach(childElement => {
                                    if(childElement.name === "direction") {
                                        spritesheet.animations[name].sprites[element.attributes.id].directions[childElement.attributes.id] = {
                                            dz: childElement.attributes.dz
                                        }
                                    }
                                });
                            }
                            break;
                        case "add":
                            if(!spritesheet.animations[name].add) spritesheet.animations[name].add = {};
                            spritesheet.animations[name].add[element.attributes.id] = {
                                align: element.attributes.align
                            }
                            break;
                        case "default":
                            break;
                        case "frames":
                            break;
                        case "frame":
                            if(!spritesheet.animations[name].frames) spritesheet.animations[name].frames = [];
                            let frame = {};
                            element.elements.forEach(childElement => {
                                if(!frame[childElement.name]) frame[childElement.name] = {};
                                frame[childElement.name][childElement.attributes.id] = childElement.attributes;
                            });
                            spritesheet.animations[name].frames.push(frame);
                            break;
                    }
                });
            });

            //animationXml.elements[0]?.elements.forEach((asset) => {
                //console.log(asset);
            //});

            fs.writeFile(`${outputPath}/${assetName}/${assetName}.json`, JSON.stringify(spritesheet), () => {
                resolve();
            });
        });
    }

}