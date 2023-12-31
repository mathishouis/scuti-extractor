export class FurniturePropertiesFormatter {
    public static format(indexValue: any, visualizationValue: any, logicValue: any): {} {
        const output = {
            layerCount: 0,
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
        const directions = logicModel.directions?.[0].direction;
        const visualizations = visualizationValue.visualizationData.graphics[0].visualization;
        const particleSystems = logicValue.objectData.particlesystems?.[0].particlesystem;
        const masks = logicValue.objectData.mask;

        if (masks) {
            output['masks'] = [];
            masks.forEach((mask) => {
                const maskAttributes = mask.$;

                output['masks'].push({
                    id: maskAttributes.type,
                });
            });
        }


        if (particleSystems) {
            output['particles'] = [];
            particleSystems.forEach((particleSystem) => {
                const particleSystemAttributes = particleSystem.$;
                if (particleSystemAttributes.size === '64') {
                    const particleSystemOutput = {
                        offsets: {
                            x: 0,
                            y: 0,
                        },
                        emitters: [],
                    };

                    if (particleSystemAttributes['offset_x']) particleSystemOutput.offsets.x = Number(particleSystemAttributes['offset_x'])
                    if (particleSystemAttributes['offset_y']) particleSystemOutput.offsets.y = Number(particleSystemAttributes['offset_y'])
                    if (particleSystemAttributes['blend']) particleSystemOutput['blend'] = Number(particleSystemAttributes['blend'])

                    if (particleSystem.emitter) particleSystem.emitter.forEach((emitter) => {
                        const emitterAttributes = emitter.$;
                        const emitterOutput = {
                            id: Number(emitterAttributes.id),
                            layerId: Number(emitterAttributes.sprite_id),
                            fuseTime: Number(emitterAttributes.fuse_time),
                            maxNumParticles: Number(emitterAttributes.max_num_particles),
                            particlesPerFrame: Number(emitterAttributes.particles_per_frame),
                            burstPulse: Number(emitterAttributes.burst_pulse),
                            particles: [],
                        };

                        const simulationAttributes = emitter.simulation[0].$;
                        if (simulationAttributes['force']) emitterOutput['force'] = Number(simulationAttributes['force']);
                        if (simulationAttributes['direction']) emitterOutput['direction'] = Number(simulationAttributes['direction']);
                        if (simulationAttributes['energy']) emitterOutput['energy'] = Number(simulationAttributes['energy']);
                        if (simulationAttributes['shape']) emitterOutput['shape'] = simulationAttributes['shape'];
                        if (simulationAttributes['gravity']) emitterOutput['gravity'] = Number(simulationAttributes['gravity']);
                        if (simulationAttributes['airfriction']) emitterOutput['airFriction'] = Number(simulationAttributes['airfriction']);

                        const particles = emitter.particles[0].particle;

                        particles.forEach((particle) => {
                            const particleAttributes = particle.$;
                            const particleOutput = {
                                frames: [],
                            };

                            if (particleAttributes['lifetime']) particleOutput['lifeTime'] = Number(particleAttributes['lifetime']);
                            if (particleAttributes['fade']) particleOutput['fade'] = particleAttributes['fade'] === 'true';
                            if (particleAttributes['is_emitter']) particleOutput['emitter'] = particleAttributes['is_emitter'] === 'true';

                            if (particle.frame) particle.frame.forEach((frame) => {
                                const frameAttributes = frame.$;
                                particleOutput.frames.push(frameAttributes.name.replace('_64_', '_'));
                            });

                            emitterOutput.particles.push(particleOutput);
                        });

                        particleSystemOutput.emitters.push(emitterOutput);
                    });

                    output['particles'].push(particleSystemOutput);
                }
            });
        }

        if (directions) directions.forEach((direction) => {
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
                output.layerCount = Number(visualizationAttributes.layerCount);

                if (visualization.colors) {
                    const colors = visualization.colors[0].color;

                    if (colors) colors.forEach((color) => {
                        const colorAttributes = color.$;
                        const colorOutput = {
                            id: Number(colorAttributes.id),
                            layers: []
                        };

                        if (color.colorLayer) color.colorLayer.forEach((layer) => {
                            const layerAttributes = layer.$;

                            colorOutput.layers.push({
                                id: Number(layerAttributes.id),
                                color: layerAttributes.color
                            });
                        });

                        output.colors.push(colorOutput);
                    });
                }

                if (visualization.layers) {
                    const layers = visualization.layers[0].layer;

                    if (layers) layers.forEach((layer) => {
                        const layerAttributes = layer.$;
                        const layerOutput = {
                            id: Number(layerAttributes.id),
                        };

                        if (layerAttributes['ink']) layerOutput['ink'] = layerAttributes['ink'];
                        if (layerAttributes['ignoreMouse']) layerOutput['interactive'] = Number(layerAttributes['ignoreMouse']) === 0;
                        if (layerAttributes['alpha']) layerOutput['alpha'] = Number(layerAttributes['alpha']);
                        if (layerAttributes['z']) layerOutput['z'] = Number(layerAttributes['z']);
                        if (layerAttributes['tag']) layerOutput['tag'] = layerAttributes['tag'];
                        if (layerAttributes['x']) layerOutput['x'] = Number(layerAttributes['x']);
                        if (layerAttributes['y']) layerOutput['y'] = Number(layerAttributes['y']);

                        output.layers.push(layerOutput);
                    });
                }

                if (visualization.animations) {
                    const animations = visualization.animations[0].animation;

                    if (animations) animations.forEach((animation) => {
                       const animationAttributes = animation.$;
                       const animationOutput = {
                           state: Number(animationAttributes.id),
                           layers: []
                       };
                       const layers = animation.animationLayer;

                       layers.forEach((layer) => {
                           const layerAttributes = layer.$;
                           const layerOutput = {
                               id: Number(layerAttributes.id)
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
