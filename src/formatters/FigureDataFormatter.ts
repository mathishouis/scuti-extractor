export class FigureDataFormatter {
    public static format(value: any): {} {
        const output = {
            palettes: [],
            sets: [],
        };

        if (value.colors[0].palette) output.palettes = value.colors[0].palette.map((palette) => this.formatPalette(palette));
        if (value.sets[0].settype) output.sets = value.sets[0].settype.map((setType) => this.formatSetType(setType));


        return output;
    }

    public static formatPalette(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined) data['id'] = Number(attributes['id']);

        data['colors'] = value.color.map((color) => this.formatColor(color));

        return data;
    }

    public static formatColor(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined) data['id'] = Number(attributes['id']);
        if (attributes['club'] !== undefined) data['club'] = attributes['club'] == '2';
        if (attributes['selectable'] !== undefined) data['selectable'] = attributes['selectable'] == '1';
        if (value._ !== undefined) data['color'] = value._;

        return data;
    }

    public static formatSetType(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['type'] !== undefined) data['type'] = attributes['type'];
        if (attributes['paletteid'] !== undefined) data['palette'] = Number(attributes['paletteid']);

        data['sets'] = value.set.map((set) => this.formatSet(set));

        return data;
    }

    public static formatSet(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined) data['id'] = Number(attributes['id']);
        if (attributes['gender'] !== undefined) data['gender'] = attributes['gender'];
        if (attributes['club'] !== undefined) data['club'] = attributes['club'] == '2';
        if (attributes['colorable'] !== undefined) data['colorable'] = attributes['colorable'] == '1';
        if (attributes['selectable'] !== undefined) data['selectable'] = attributes['selectable'] == '1';
        if (attributes['preSelectable'] !== undefined) data['preSelectable'] = attributes['preSelectable'] == '1';
        if (attributes['sellable'] !== undefined) data['sellable'] = attributes['sellable'] == '1';

        data['parts'] = value.part.map((part) => this.formatPart(part));

        return data;
    }

    public static formatPart(value: any): {} {
        const data = {};
        const attributes = value.$;

        if (attributes['id'] !== undefined) data['id'] = Number(attributes['id']);
        if (attributes['type'] !== undefined) data['type'] = attributes['type'];
        if (attributes['colorable'] !== undefined) data['colorable'] = attributes['colorable'] == '1';
        if (attributes['colorindex'] !== undefined) data['colorIndex'] = Number(attributes['colorindex']);

        return data;
    }
}
