import fs from "fs";
import path from "path";
import {SWFDataExtractor} from "../utils/SWFDataExtractor";
import {SpritesheetBuilder} from "../builders/SpritesheetBuilder";
import {OffsetBuilder} from "../builders/OffsetBuilder";
import {VisualizationBuilder} from "../builders/VisualizationBuilder";
import {deleteFurniFile} from "../utils/TemporaryFile";

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

    public run() {
        console.log("\x1b[0m", ">", "\x1b[32m", "Running FurnitureTask...", "\x1b[0m");
        const startDate: Date = new Date();
        this._fileQueue.forEach(async file => {
            let assetName: string = path.basename(path.basename(file), path.extname(file));
            await new SWFDataExtractor().extract(assetName, "./input/furnitures", "./output/furnitures");
            await new SpritesheetBuilder().build(assetName, "./output/furnitures");
            await new OffsetBuilder().buildFurnitureOffset(assetName, "./output/furnitures");
            await new VisualizationBuilder().buildFurnitureVisualization(assetName, "./output/furnitures");
            await deleteFurniFile(assetName, "./output/furnitures");
        });
        const endDate: Date = new Date();
        console.log("\x1b[0m", ">", "\x1b[32m", "FurnitureTask finished in " + (endDate.getTime() - startDate.getTime()) + "ms.", "\x1b[0m");
    }

}