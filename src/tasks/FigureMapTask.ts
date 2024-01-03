import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import { error, log } from '../utils/Logger';
import { parseStringPromise } from 'xml2js';
import { FurnitureDataFormatter } from '../formatters/FurnitureDataFormatter';
import { writeFileSyncRecursive } from '../utils/File';
import {FigureMapFormatter} from "../formatters/FigureMapFormatter";

interface Configuration {
    path: string;
}

export class FigureMapTask extends Task {
    public path: string;

    constructor({ path }: Configuration) {
        super();

        this.path = path;
    }

    public async run(): Promise<void> {
        if (path.extname(this.path) !== '.xml') return error('FigureMapTask', 'The given file is not an XML file.');

        log('FigureMapTask', 'Running FigureMapTask...');

        const file = fs.readFileSync(this.path.replaceAll('/', '\\'), 'utf-8');
        const parsedFile = await parseStringPromise(file);

        if (!parsedFile.map.lib) return error('FigureMapTask', 'Malformed XML file.');

        const formattedFile = FigureMapFormatter.format(parsedFile.map);

        writeFileSyncRecursive('.\\output\\data\\figuremap.data', JSON.stringify(formattedFile));

        log('FigureMapTask', 'FigureMapTask ended!');
    }
}
