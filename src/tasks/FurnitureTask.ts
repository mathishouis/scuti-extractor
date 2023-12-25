import { Task } from './Task';
import * as fs from 'fs';
import * as path from 'path';
import { warn } from '../utils/Logger';
import { extract } from '../utils/SWF';

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

        fileNames.forEach((fileName) => {
           console.log(fileName);
           //const file = fs.readFileSync(this.path + '/' + fileName, { encoding: 'utf-8' });

           extract(path.parse(fileName).name, this.path + '/' + fileName, './output/furnitures/');
        });
    }
}
