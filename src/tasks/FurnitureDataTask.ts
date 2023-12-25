import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import { error, log } from '../utils/Logger';
import { parseStringPromise } from 'xml2js';
import { FurnitureDataFormatter } from '../formatters/FurnitureDataFormatter';
import { writeFileSyncRecursive } from '../utils/File';

interface Configuration {
    path: string;
}

export class FurnitureDataTask extends Task {
    public path: string;

    constructor({ path }: Configuration) {
        super();

        this.path = path;
    }

    public async run(): Promise<void> {
        if (path.extname(this.path) !== '.xml') return error('FurnitureDataTask', 'The given file is not an XML file.');

        log('FurnitureDataTask', 'Running FurnitureDataTask...');

        const file = fs.readFileSync(this.path.replaceAll('/', '\\'), 'utf-8');
        const parsedFile = await parseStringPromise(file);

        if (!parsedFile.furnidata) return error('FurnitureDataTask', 'Malformed XML file.');

        const formattedFile = FurnitureDataFormatter.format(parsedFile.furnidata);

        writeFileSyncRecursive('.\\output\\data\\furnitures.data', JSON.stringify(formattedFile));

        log('FurnitureDataTask', 'FurnitureDataTask ended!');
    }
}
