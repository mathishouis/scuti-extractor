import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import {log, warn} from '../utils/Logger';
import { extract } from '../utils/SWF';
import {spritesheet} from "../utils/Spritesheet";

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

            await extract(assetName, `${this.path}/${fileName}`, './output/furnitures/');
            await spritesheet(assetName, `./output/furnitures/${assetName}/images/`, `./output/furnitures/${assetName}/`);
            warn('FurnitureTask', `Converted ${assetName}`);
        }

        log('FurnitureTask', 'FurnitureTask ended!');
    }
}
