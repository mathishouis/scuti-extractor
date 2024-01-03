import {inspect} from "util";

export class FurnitureDataFormatter {
    public static format(value: any): {} {
        const output = {
            floors: [],
            walls: [],
        };

        if (value.roomitemtypes) value.roomitemtypes.forEach((roomItemType) => {
            const furniTypes = roomItemType.furnitype;
            if (furniTypes && Array.isArray(furniTypes)) output.floors = furniTypes.map((furniType) => this.formatTypes(furniType, 'floor'));
        });

        if (value.wallitemtypes) value.wallitemtypes.forEach((wallItemType) => {
            const furniTypes = wallItemType.furnitype;
            if (furniTypes && Array.isArray(furniTypes)) output.walls = furniTypes.map((furniType) => this.formatTypes(furniType, 'wall'));
        });

        return output;
    }

    public static formatTypes(value: any, type: string): {} {
        const data = {};
        const attributes = value.$;
        const id: number = ((attributes && parseInt(attributes.id)) || 0);
        const className: string = ((attributes && attributes.classname) || '').split('*')[0];
        const colorId: number = Number(((attributes && attributes.classname) || '').split('*')[1]);
        const offerId: number = ((value.offerid && parseInt(value.offerid[0])) || 0);

        data['id'] = id;
        data['name'] = className;

        if (offerId !== -1) data['offer_id'] = offerId;
        if (colorId) data['color_id'] = colorId;

        if (type === 'floor') {
            const direction: number = ((value.defaultdir && parseInt(value.defaultdir[0])) || 0);
            //const sizeX: number = ((value.xdim && parseInt(value.xdim[0])) || 0);
            //const sizeY: number = ((value.ydim && parseInt(value.ydim[0])) || 0);
            const colors: string[] = [];

            if (value.partcolors) value.partcolors.forEach((partcolors) => {
                const colorData = partcolors.color;

                if (colorData) colorData.forEach((color) => {
                    let code = color;
                    if(code.charAt(0) !== '#') code = ('#' + code);
                    colors.push(code);
                });
            });

            data['direction'] = direction;
            /*data['size'] = {
                x: sizeX,
                y: sizeY,
            };*/
            if (colors.length) data['colors'] = colors;
        }

        return data;
    }
}
