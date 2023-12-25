import path from 'path';
import * as fs from 'fs';

function writeFileSyncRecursive(filename, content): void {
    const folders = filename.split(path.sep).slice(0, -1);
    console.log(filename, path.sep);
    if (folders.length) folders.reduce((last, folder) => {
        const folderPath = last ? last + path.sep + folder : folder;
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
        return folderPath;
    });

    fs.writeFileSync(filename, content, 'utf-8');
}

export {
    writeFileSyncRecursive,
};
