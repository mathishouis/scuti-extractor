import SWFReader from '@gizeta/swf-reader';
import { writeFileSyncRecursive } from './File';
import * as zlib from 'zlib';
import Jimp from 'jimp';

// Source: https://github.com/higoka/habbo-swf-extractor
function extract(name: string, input: string, output: string): void {
    const swf = SWFReader.readSync(input);

    const map = swf.tags.find((tag) => tag.header.code === 76).symbols.map((symbol) => {
        symbol.name = symbol.name.substring(name.length + 1);
        return symbol;
    });

    swf.tags.forEach((tag) => {
        // Binary
        if (tag.header.code === 87) {
            const symbol = map.find((symbol) => symbol.id === tag.data.readUInt16LE());
            if (symbol) writeFileSyncRecursive(`${output}/${name}/binaries/${symbol.name}.xml`.replaceAll('/', '\\'), tag.data.slice(6));
        }

        // Image
        if (tag.header.code === 36) {
            const symbol = map.find((symbol) => symbol.id === tag.characterId)

            if (symbol) {
                const image = new Jimp(tag.bitmapWidth, tag.bitmapHeight)
                const bitmap = zlib.unzipSync(Buffer.from(tag.zlibBitmapData, 'hex'))

                let pos = 0

                for (let y = 0; y < tag.bitmapHeight; y++) {
                    for (let x = 0; x < tag.bitmapWidth; x++) {
                        const a = bitmap.readUInt8(pos++)
                        const r = bitmap.readUInt8(pos++)
                        const g = bitmap.readUInt8(pos++)
                        const b = bitmap.readUInt8(pos++)

                        image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y)
                    }
                }

                image.write(`${output}/${name}/images/${symbol.name}.png`);
            }
        }
    });
}

export {
    extract,
};
