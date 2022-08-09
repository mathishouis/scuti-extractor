import fs from "fs";
import path from "path";

export class FurnitureTask {

    private _fileQueue: string[] = [];

    public initialise(): void {
        console.log("\x1b[0m", ">", "\x1b[33m", "Initialising FurnitureTask...", "\x1b[0m");
        fs.readdir('./input/furnitures/', async (err, files) => {
            if(err) {
                throw err;
            }
            files.forEach(file => {
                if(path.extname(file) === ".swf") {
                    this._fileQueue.push(file);
                } else {
                    console.log("\x1b[0m", ">>", "\x1b[31m", `Cannot add ${file} to queue, it's not a swf file.`, "\x1b[0m");
                }
            });
        });
    }

    public run() {
        this._fileQueue.forEach(file => {
            console.log(file);
        });
    }

}