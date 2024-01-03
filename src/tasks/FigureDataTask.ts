import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import { error, log } from '../utils/Logger';
import { parseStringPromise } from 'xml2js';
import { FurnitureDataFormatter } from '../formatters/FurnitureDataFormatter';
import { writeFileSyncRecursive } from '../utils/File';
import {FigureMapFormatter} from "../formatters/FigureMapFormatter";
import {FigureDataFormatter} from "../formatters/FigureDataFormatter";

interface Configuration {
    path: string;
}

export class FigureDataTask extends Task {
    public path: string;

    constructor({ path }: Configuration) {
        super();

        this.path = path;
    }

    public async run(): Promise<void> {
        if (path.extname(this.path) !== '.xml') return error('FigureDataTask', 'The given file is not an XML file.');

        log('FigureDataTask', 'Running FigureMapTask...');

        const file = fs.readFileSync(this.path.replaceAll('/', '\\'), 'utf-8');
        const parsedFile = await parseStringPromise(file);

        if (!parsedFile.figuredata) return error('FigureDataTask', 'Malformed XML file.');

        const formattedFile = FigureDataFormatter.format(parsedFile.figuredata);

        writeFileSyncRecursive('.\\output\\data\\figuredata.data', JSON.stringify(formattedFile));

        log('FigureMapTask', 'FigureMapTask ended!');
    }
}
