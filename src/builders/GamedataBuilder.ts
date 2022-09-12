import fs from "fs";
import {xml2js} from "xml-js";

export class GamedataBuilder {

    public buildFurnidata(inputPath: string, outputPath: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            try {
                console.log(`${inputPath}/furnidata.xml`)
                let furnidataXml: any = fs.readFileSync(`${inputPath}/furnidata.xml`);
                furnidataXml = xml2js(furnidataXml, {compact: true});
                let furnidata = {
                    "floorItems": [
                    ],
                    "wallItems": [

                    ]
                }
                furnidataXml['furnidata']['roomitemtypes']['furnitype'].forEach(furniture => {
                    furnidata['floorItems'].push({
                        "id":parseInt(furniture._attributes.id),
                        "className":furniture._attributes.classname,
                        "name":furniture.name._text,
                        "description":furniture.description._text,
                        "furniLine":furniture.furniline._text,
                        "offerId":parseInt(furniture.offerid._text),
                        "adUrl":"",
                        "excludeDynamic":furniture.excludeddynamic._text,
                        "specialType":parseInt(furniture.specialtype._text),
                        "customParams":"",
                        "dimensions":{
                            "x":parseInt(furniture.xdim._text),
                            "y":parseInt(furniture.ydim._text),
                            "defaultDirection":furniture.defaultdir._text
                        },
                        "canStandOn":parseInt(furniture.canstandon._text) === 1,
                        "canSitOn":parseInt(furniture.cansiton._text) === 1,
                        "canLayOn":parseInt(furniture.canlayon._text) === 1
                    })
                });
                furnidataXml['furnidata']['wallitemtypes']['furnitype'].forEach(furniture => {
                    furnidata['wallItems'].push({
                        "id":parseInt(furniture._attributes.id),
                        "className":furniture._attributes.classname,
                        "name":furniture.name._text,
                        "description":furniture.description._text,
                        "furniLine":furniture.furniline._text,
                        "offerId":parseInt(furniture.offerid._text),
                        "adUrl":"",
                        "excludeDynamic":furniture.excludeddynamic._text,
                        "specialType":parseInt(furniture.specialtype._text),
                        "customParams":null
                    })
                });
                fs.writeFile(`${outputPath}/furnidata.json`, JSON.stringify(furnidata), () => {
                    resolve(true);
                });
                resolve(true);
            } catch(e) {
                resolve(false);
            }
        });
    }

}