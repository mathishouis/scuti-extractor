import nodeSpriteGenerator from 'node-sprite-generator';

async function spritesheet(name: string, input: string, output: string): Promise<void> {
    await nodeSpriteGenerator({
        src: [
            `${input}/*.png`
        ],
        spritePath: `${output}/${name}.png`,
        stylesheetPath: `${output}/${name}.json`,
        layout: 'packed',
        compositor: 'jimp',
        stylesheet: './src/assets/spritesheet.tpl',
    });
}

export {
    spritesheet,
};
