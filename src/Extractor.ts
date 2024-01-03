import nodePackage from '../package.json';
import configuration from '../configuration.json';
import {Task} from "./tasks/Task";
import {FurnitureDataTask} from "./tasks/FurnitureDataTask";
import {FurnitureTask} from "./tasks/FurnitureTask";
import {FigureMapTask} from "./tasks/FigureMapTask";

export class Extractor {
    public tasks: (new (configuration: any) => Task)[] = [
        FurnitureDataTask
    ];
    public async initialize(): Promise<void> {
        console.log("\x1b[33m", "   _____            _   _                      \n" +
            "  / ____|          | | (_)                     \n" +
            " | (___   ___ _   _| |_ _                      \n" +
            "  \\___ \\ / __| | | | __| |                     \n" +
            "  ____) | (__| |_| | |_| |                     \n" +
            " |_____/ \\___|\\__,_|\\__|_|       _             \n" +
            " |  ____|    | |                | |            \n" +
            " | |__  __  _| |_ _ __ __ _  ___| |_ ___  _ __ \n" +
            " |  __| \\ \\/ / __| '__/ _` |/ __| __/ _ \\| '__|\n" +
            " | |____ >  <| |_| | | (_| | (__| || (_) | |   \n" +
            " |______/_/\\_\\\\__|_|  \\__,_|\\___|\\__\\___/|_|   \n" +
            "                                               ");
        console.log("\x1b[0m", ">", "\x1b[32m", `Version ${nodePackage.version}`);
        console.log("\x1b[0m", "\n");

        await new FurnitureDataTask({path: configuration['task.furnituredata.path']}).run();
        await new FurnitureTask({path: configuration['task.furniture.path']}).run();
        await new FigureMapTask({path: configuration['task.figuremap.path']}).run();
    }

}
