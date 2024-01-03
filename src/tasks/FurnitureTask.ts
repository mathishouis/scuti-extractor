import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import {log, warn} from '../utils/Logger';
import { extract } from '../utils/SWF';
import {spritesheet} from '../utils/Spritesheet';
import { parseStringPromise } from 'xml2js';
import { FurniturePropertiesFormatter } from '../formatters/FurniturePropertiesFormatter';
import { writeFileSync } from 'fs';
import { Bundle } from 'scuti-bundle';
import { SpritesheetFormatter } from '../formatters/SpritesheetFormatter';

interface Configuration {
    path: string;
}

export class FurnitureTask extends Task {
    public path: string;

    constructor({ path }: Configuration) {
        super();

        this.path = path;
    }

    public async run(): Promise<void> {
        const fileNames: string[] = fs.readdirSync(this.path.replaceAll('/', '\\'));

        if (fileNames.length === 0) return warn('FurnitureTask', 'There is no furniture to convert!');

        log('FurnitureTask', 'Running FurnitureTask...');

        for (const fileName of fileNames) {
            const assetName = path.parse(fileName).name;

            await extract(assetName, `${this.path}/${fileName}`, './output/bundles/furnitures/');
            await spritesheet(assetName, `./output/bundles/furnitures/${assetName}/images/`, `./output/bundles/furnitures/${assetName}/`);

            const indexFile = fs.readFileSync(`./output/bundles/furnitures/${assetName}/binaries/index.xml`, 'utf-8');
            const assetsFile = fs.readFileSync(`./output/bundles/furnitures/${assetName}/binaries/${assetName}_assets.xml`, 'utf-8');
            const visualizationFile = fs.readFileSync(`./output/bundles/furnitures/${assetName}/binaries/${assetName}_visualization.xml`, 'utf-8');
            const logicFile = fs.readFileSync(`./output/bundles/furnitures/${assetName}/binaries/${assetName}_logic.xml`, 'utf-8');

            const formattedFile = FurniturePropertiesFormatter.format(
                await parseStringPromise(indexFile),
                await parseStringPromise(visualizationFile),
                await parseStringPromise(logicFile)
            );

            const spritesheetFile = JSON.parse(fs.readFileSync(`./output/bundles/furnitures/${assetName}/${assetName}.json`, 'utf-8'));
            spritesheetFile['properties'] = formattedFile;

            const formatedSpritesheet = SpritesheetFormatter.format(
                await parseStringPromise(assetsFile),
                spritesheetFile
            );

            await writeFileSync(`./output/bundles/furnitures/${assetName}/${assetName}.json`, JSON.stringify(formatedSpritesheet));

            const bundle = new Bundle();
            bundle.add('texture', fs.readFileSync(`./output/bundles/furnitures/${assetName}/${assetName}.png`));
            bundle.add('data', fs.readFileSync(`./output/bundles/furnitures/${assetName}/${assetName}.json`));
            fs.writeFileSync(`./output/bundles/furnitures/${assetName}.bundle`, bundle.buffer);

            fs.rmSync(`./output/bundles/furnitures/${assetName}`, { recursive: true, force: true });

            warn('FurnitureTask', `Converted ${assetName}`);
        }

        log('FurnitureTask', 'FurnitureTask ended!');
    }
}
