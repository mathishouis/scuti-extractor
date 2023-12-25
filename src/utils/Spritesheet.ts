import nodeSpriteGenerator from 'node-sprite-generator';

async function spritesheet(name: string, input: string, output: string): Promise<void> {
    return new Promise<void>(resolve => {
        nodeSpriteGenerator({
            src: [
                `${input}/*.png`
            ],
            spritePath: `${output}/${name}.png`,
            stylesheetPath: `${output}/${name}.json`,
            layout: 'packed',
            compositor: 'jimp',
            stylesheet: './src/assets/spritesheet.tpl',
        }, (err) => {
            resolve();
        });
    });
}

export {
    spritesheet,
};
