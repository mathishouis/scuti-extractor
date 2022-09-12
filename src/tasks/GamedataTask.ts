import fs from "fs";
import path from "path";
import {SWFDataExtractor} from "../utils/SWFDataExtractor";
import {SpritesheetBuilder} from "../builders/SpritesheetBuilder";
import {OffsetBuilder} from "../builders/OffsetBuilder";
import {VisualizationBuilder} from "../builders/VisualizationBuilder";
import {deleteFurniFile} from "../utils/TemporaryFile";
import readline from "readline";
import {GamedataBuilder} from "../builders/GamedataBuilder";

export class GamedataTask {

    private _fileQueue: string[] = [];

    public initialise(): Promise<void> {
        console.log("\x1b[0m", ">", "\x1b[33m", "Initialising FurnidataTask...", "\x1b[0m");
        return new Promise<void>(async resolve => {
            fs.readdir('./input_dev/gamedata/', async (err, files) => {
                if (err) {
                    throw err;
                }
                files.forEach(file => {
                    if (path.extname(file) === ".xml") {
                        this._fileQueue.push(file);
                    } else {
                        console.log("\x1b[0m", ">>", "\x1b[31m", `Cannot add ${file} to queue, it's not a xml file.`, "\x1b[0m");
                    }
                });
                resolve();
            });
        });
    }

    public async run() {
        console.log("\x1b[0m", ">", "\x1b[32m", "Running FurnidataTask...", "\x1b[0m");
        const startDate: Date = new Date();
        let fileCount: number = 0;
        for (const file of this._fileQueue) {
            let assetName: string = path.basename(path.basename(file), path.extname(file));
            try {
                fileCount += 1;
                await new GamedataBuilder().buildFurnidata("./input_dev/gamedata", "../scuti-resources/gamedata/")
                /*if(!await new SWFDataExtractor().extract(assetName, "./input/furnitures", "../scuti-resources/furniture/")) continue;
                await new SpritesheetBuilder().build(assetName, "../scuti-resources/furniture/");

                await new OffsetBuilder().buildFurnitureOffset(assetName, "../scuti-resources/furniture/");
                if(!await new VisualizationBuilder().buildFurnitureVisualization(assetName, "../scuti-resources/furniture/")) continue;
                await deleteFurniFile(assetName, "../scuti-resources/furniture/");*/
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