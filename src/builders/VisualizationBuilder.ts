import fs from "fs";
import {xml2js} from "xml-js";

export class VisualizationBuilder {

    public buildFurnitureVisualization(assetName: string, outputPath: string) {
        return new Promise<boolean>(async resolve => {
            try {
                let spritesheet: any = fs.readFileSync(`${outputPath}/${assetName}/${assetName}.json`);
                spritesheet = JSON.parse(spritesheet);
                let indexXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_index.bin`);
                indexXml = xml2js(indexXml, {compact: true});
                let visualizationXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_${assetName}_visualization.bin`);
                visualizationXml = xml2js(visualizationXml, {compact: true});
                let logicXml: any = fs.readFileSync(`${outputPath}/${assetName}/binaries/${assetName}_${assetName}_visualization.bin`);
                logicXml = xml2js(logicXml, {compact: true});

                const furniProperty = {
                    infos: {
                        logic: undefined,
                        visualization: undefined,
                    },
                    dimensions: {
                        x: undefined,
                        y: undefined,
                        z: undefined,
                    },
                    visualization: {
                        layerCount: undefined,
                        layers: {},
                        directions: [],
                        colors: {},
                        animation: {},
                    },
                };
                furniProperty.infos.logic = indexXml?.object?._attributes?.logic;
                furniProperty.infos.visualization = indexXml?.object?._attributes?.visualization;
                furniProperty.dimensions.x = parseInt(logicXml?.objectData?.model?.dimensions?._attributes?.x);
                furniProperty.dimensions.y = parseInt(logicXml?.objectData?.model?.dimensions?._attributes?.y);
                furniProperty.dimensions.z = logicXml?.objectData?.model?.dimensions?._attributes?.z;

                const visualization = visualizationXml?.visualizationData?.graphics.visualization.filter((vis) => (vis._attributes !== undefined) && (vis._attributes.size !== undefined) && vis._attributes.size === '64').pop();
                furniProperty.visualization.layerCount = visualization?._attributes?.layerCount !== undefined ? parseInt(visualization._attributes.layerCount) : 0;

                if (visualization?.layers !== undefined) {
                    this.formatArray(visualization.layers?.layer).forEach((layer) => {
                        if (layer?._attributes.id !== undefined) {
                            furniProperty.visualization.layers[parseInt(layer._attributes.id)] = {
                                id: parseInt(layer._attributes?.id),
                                ink: layer._attributes?.ink,
                                alpha: layer._attributes?.alpha !== undefined ? parseInt(layer._attributes?.alpha) : undefined,
                                z: layer._attributes?.z,
                                ignoreMouse: layer._attributes?.ignoreMouse === '1',
                            };
                        }
                    });
                }

                if (visualization?.directions !== undefined) {
                    this.formatArray(visualization?.directions?.direction).forEach((direction) => {
                        furniProperty.visualization.directions.push(parseInt(direction._attributes.id));
                    });
                }

                if (visualization?.colors !== undefined) {
                    this.formatArray(visualization.colors.color).forEach((color) => {
                        furniProperty.visualization.colors[parseInt(color._attributes.id)] = {};

                        if (color?.colorLayer?.length > 0) {
                            color.colorLayer.forEach((colorLayer) => {
                                furniProperty.visualization.colors[parseInt(color._attributes.id)][parseInt(colorLayer._attributes.id)] = colorLayer._attributes.color;
                            });
                        } else if (typeof color?.colorLayer === 'object' && color?.colorLayer?._attributes !== undefined && color?.colorLayer?._attributes.id !== undefined) {
                            furniProperty.visualization.colors[parseInt(color._attributes.id)][parseInt(color?.colorLayer._attributes.id)] = color?.colorLayer._attributes.color;
                        }
                    });
                }

                if (visualization?.animations !== undefined) {
                    this.formatArray(visualization.animations.animation).forEach((animation) => {
                        furniProperty.visualization.animation[animation._attributes.id] = {};

                        this.formatArray(animation?.animationLayer).forEach((animationLayer) => {
                            const frameSequence = [];

                            this.formatArray(animationLayer?.frameSequence).forEach((fs) => {
                                this.formatArray(fs.frame).forEach((elm) => {
                                    frameSequence.push(parseInt(elm._attributes.id));
                                });
                            });

                            furniProperty.visualization.animation[animation._attributes.id][animationLayer._attributes.id] = {
                                frameSequence,
                                loopCount: animationLayer?._attributes?.loopCount !== undefined ? parseInt(animationLayer?._attributes?.loopCount) : undefined,
                                random: animationLayer?._attributes?.random !== undefined ? parseInt(animationLayer?._attributes?.random) : undefined,
                                frameRepeat: animationLayer?._attributes?.frameRepeat !== undefined ? parseInt(animationLayer?._attributes?.frameRepeat) : undefined,
                            };
                        });
                    });
                }
                spritesheet.furniProperty = furniProperty;
                fs.writeFile(`${outputPath}/${assetName}/${assetName}.json`, JSON.stringify(spritesheet), () => {
                    resolve(true);
                });
            } catch (e) {
                resolve(false)
            }
        });
    }

    formatArray(elm: any) {
        if (elm === undefined) return [];
        return elm.length === undefined ? [elm] : elm;
    }

}