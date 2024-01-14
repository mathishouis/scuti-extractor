export class FigureAnimationFormatter {
    public static format(value: any): {} {
        const output = [];

        const library = value.manifest.library[0];
        const assets = library.assets?.[0].asset;
        const aliases = library.aliases?.[0].alias;

        console.log(assets, aliases);


        return output;
    }
}
