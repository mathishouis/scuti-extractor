![](https://zupimages.net/up/20/26/jo6y.png)

## Scuti Extractor — Habbo SWF extractor for Scuti

[![](https://dcbadge.vercel.app/api/server/tKXnzSR?style=flat&theme=plastic)](https://discord.gg/tKXnzSR)
![Lines of code](https://img.shields.io/tokei/lines/github/kozennnn/scuti-extractor?color=yellow&logo=github)

An open-source Habbo SWF extractor written in TypeScript for [scuti-renderer](https://github.com/kozennnn/scuti-renderer).

### Follow us

Join our [Discord](https://discord.gg/s6fQAPt) server and get in touch with members of our community. You can ask help or simply talk with us, don't be shy!

### Features

- Furnidata.xml conversion
- Furnitures conversion

### Installation

The Scuti extractor is really easy to install with just a few commands.
You can start by copying the example configuration:
```shell
cp configuration.example.json configuration.json
```

After copying it, you can change the path to the assets that you want to convert.

Then you can install the dependencies:
```shell
npm install
```

And run the extractor!
```shell
npm run start
```

This will give you an output folder with all the extracted assets. The output directory structure follows the one used in [scuti-resources](https://github.com/kozennnn/scuti-resources). So if you want to use these assets into your project, just clone the scuti-resources repository and paste the extracted resources in it.
