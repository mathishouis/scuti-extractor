import fs from "fs";
import path from "path";
import {SWFDataExtractor} from "../utils/SWFDataExtractor";
import {SpritesheetBuilder} from "../builders/SpritesheetBuilder";
import {OffsetBuilder} from "../builders/OffsetBuilder";
import {VisualizationBuilder} from "../builders/VisualizationBuilder";
import {deleteFurniFile} from "../utils/TemporaryFile";
import readline from "readline";

export class FurnitureTask {

    private _fileQueue: string[] = [];

    public initialise(): Promise<void> {
        console.log("\x1b[0m", ">", "\x1b[33m", "Initialising FurnitureTask...", "\x1b[0m");
        return new Promise<void>(async resolve => {
            fs.readdir('./input/furnitures/', async (err, files) => {
                if (err) {
                    throw err;
                }
                files.forEach(file => {
                    if (path.extname(file) === ".swf") {
                        this._fileQueue.push(file);
                    } else {
                        console.log("\x1b[0m", ">>", "\x1b[31m", `Cannot add ${file} to queue, it's not a swf file.`, "\x1b[0m");
                    }
                });
                resolve();
            });
        });
    }

    public async run() {
        console.log("\x1b[0m", ">", "\x1b[32m", "Running FurnitureTask...", "\x1b[0m");
        const startDate: Date = new Date();
        let fileCount: number = 0;
        for (const file of this._fileQueue) {
            let assetName: string = path.basename(path.basename(file), path.extname(file));
            try {
                fileCount += 1;
                if(!await new SWFDataExtractor().extract(assetName, "./input/furnitures", "./output/furnitures")) continue;
                await new SpritesheetBuilder().build(assetName, "./output/furnitures");

                await new OffsetBuilder().buildFurnitureOffset(assetName, "./output/furnitures");
                if(!await new VisualizationBuilder().buildFurnitureVisualization(assetName, "./output/furnitures")) continue;
                await deleteFurniFile(assetName, "./output/furnitures");
                readline.clearLine(process.stdout, 0);
                process.stdout.cursorTo(0);
                process.stdout.write("\x1b[0m" + " >> " + "\x1b[33m" + fileCount + "\x1b[0m" + "/" + "\x1b[33m" + this._fileQueue.length + " \x1b[43m\x1b[37m" + assetName + "\x1b[0m");

            } catch (e) {

            }
        }
        const endDate: Date = new Date();
        console.log("\x1b[0m", ">", "\x1b[32m", "FurnitureTask finished in " + (endDate.getTime() - startDate.getTime()) + "ms.", "\x1b[0m");
    }

}