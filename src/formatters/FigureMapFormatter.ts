export class FigureMapFormatter {
    public static format(value: any): {} {
        const output = {
            libs: [],
        };

        output.libs = value.lib.map((lib) => this.formatLib(lib));

        /*if (value.roomitemtypes) value.roomitemtypes.forEach((roomItemType) => {
            const furniTypes = roomItemType.furnitype;
            if (furniTypes && Array.isArray(furniTypes)) output.floors = furniTypes.map((furniType) => this.formatTypes(furniType, 'floor'));
        });*/

        return output;
    }

    public static formatLib(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined) data['id'] = attributes['id'];
        if (value.part.length > 0) data['parts'] = value.part.map((part) => this.formatPart(part));

        return data;
    }

    public static formatPart(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined)  data['id'] = attributes['id'];
        if (attributes['type'] !== undefined)  data['type'] = attributes['type'];

        return data;
    }
}
