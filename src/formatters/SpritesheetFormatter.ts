export class SpritesheetFormatter {
    public static format(assetsValue: any, spritesheetValue: any): {} {
        const assets = assetsValue.assets.asset;

        assets.forEach((asset) => {
            const assetAttributes = asset.$;

            if (spritesheetValue.frames[assetAttributes.name]) {
                const { spriteSourceSize } = spritesheetValue.frames[assetAttributes.name];
                const flipped = assetAttributes.flipH !== undefined;

                spriteSourceSize.x = -Number(assetAttributes.x);
                spriteSourceSize.y = -Number(assetAttributes.y);

                if (flipped) spriteSourceSize.flipped = flipped;
            } else if (assetAttributes.source && spritesheetValue.frames[assetAttributes.source]) {
                const { frame, sourceSize, spriteSourceSize } = spritesheetValue.frames[assetAttributes.source];
                const flipped = assetAttributes.flipH !== undefined;

                spritesheetValue.frames[assetAttributes.name] = {
                    frame: frame,
                    sourceSize: sourceSize,
                    spriteSourceSize: {
                        x: -Number(assetAttributes.x),
                        y: -Number(assetAttributes.y),
                        w: spriteSourceSize.w,
                        h: spriteSourceSize.h
                    },
                    rotated: false,
                    trimmed: true
                };

                if (flipped) spritesheetValue.frames[assetAttributes.name].flipped = flipped;
            }
        });

        return spritesheetValue;
    }
}
