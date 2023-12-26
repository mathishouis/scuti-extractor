export class FurniturePropertiesFormatter {
    public static format(indexValue: any, visualizationValue: any, logicValue: any): {} {
        const output = {
            //layerCount: 0,
            logic: '',
            visualization: '',
            dimensions: {
                x: null,
                y: null,
                z: null,
            },
            directions: [],
            colors: [],
            layers: [],
            animations: [],
        };

        const indexAttributes = indexValue.object.$;
        output.visualization = indexAttributes.visualization;
        output.logic = indexAttributes.logic;

        const logicModel = logicValue.objectData.model[0];
        const dimensionsAttributes = logicModel.dimensions[0].$;
        const directions = logicModel.directions[0].direction;
        const visualizations = visualizationValue.visualizationData.graphics[0].visualization;

        directions.forEach((direction) => {
           const directionAttributes = direction.$;
           output.directions.push((Number(directionAttributes.id) / 90) * 2);
        });

        output.dimensions = {
            x: Number(dimensionsAttributes.x),
            y: Number(dimensionsAttributes.y),
            z: Number(dimensionsAttributes.z),
        };

        visualizations.forEach((visualization) => {
            const visualizationAttributes = visualization.$;

            if (visualizationAttributes.size === '64') {
                //output.layerCount = Number(visualizationAttributes.layerCount);

                if (visualization.colors) {
                    const colors = visualization.colors[0].color;

                    if (colors) colors.forEach((color) => {
                        const colorAttributes = color.$;
                        const colorOutput = {
                            id: Number(colorAttributes.id),
                            layers: []
                        };

                        if (color.colorLayer) color.colorLayer.forEach((layer) => {
                            colorOutput.layers.push({
                                id: Number(layer.id),
                                color: layer.color
                            });
                        });

                        output.colors.push(colorOutput);
                    });
                }

                if (visualization.layers) {
                    const layers = visualization.layers[0].layer;

                    layers.forEach((layer) => {
                        const layerAttributes = layer.$;
                        const layerOutput = {
                            id: Number(layerAttributes.id),
                        };

                        if (layerAttributes['ink']) layerOutput['ink'] = layerAttributes['ink'];
                        if (layerAttributes['ignoreMouse']) layerOutput['interactive'] = Number(layerAttributes['ignoreMouse']) === 0;
                        if (layerAttributes['alpha']) layerOutput['alpha'] = Number(layerAttributes['alpha']);
                        if (layerAttributes['z']) layerOutput['z'] = Number(layerAttributes['z']);

                        output.layers.push(layerOutput);
                    });
                }

                if (visualization.animations) {
                    const animations = visualization.animations[0].animation;

                    animations.forEach((animation) => {
                       const animationAttributes = animation.$;
                       const animationOutput = {
                           state: Number(animationAttributes.id),
                           layers: []
                       };
                       const layers = animation.animationLayer;

                       layers.forEach((layer) => {
                           const layerAttributes = layer.$;
                           const layerOutput = {
                               id: layerAttributes.id
                           };

                           if (layerAttributes['frameRepeat']) layerOutput['frameRepeat'] = Number(layerAttributes['frameRepeat']);
                           if (layerAttributes['loopCount']) layerOutput['loopCount'] = Number(layerAttributes['loopCount']);
                           if (layer.frameSequence) {
                               layerOutput['frames'] = [];
                               const frames = layer.frameSequence[0].frame;

                               frames.forEach((frame) => {
                                   const frameAttributes = frame.$;
                                   layerOutput['frames'].push(Number(frameAttributes.id));
                               });
                           }

                           animationOutput.layers.push(layerOutput);
                       });

                       output.animations.push(animationOutput);
                    });
                }
            }
        });

        return output;
    }
}
