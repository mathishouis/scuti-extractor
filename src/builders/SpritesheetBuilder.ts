import nodeSpriteGenerator from 'node-sprite-generator';

export class SpritesheetBuilder {

    public build(assetName: string, outputPath: string): Promise<void> {
        return new Promise<void>(resolve => {
            nodeSpriteGenerator({
                src: [
                    `${outputPath}/${assetName}/sprites/*.png`
                ],
                spritePath: `${outputPath}/${assetName}/${assetName}.png`,
                stylesheetPath: `${outputPath}/${assetName}/${assetName}.json`,
                layout: 'packed',
                compositor: 'jimp',
                stylesheet: './src/assets/spritesheet.tpl',
            }, (err) => {
                if (err) {
                    throw err;
                }
                resolve();
            });
        });
    }

}