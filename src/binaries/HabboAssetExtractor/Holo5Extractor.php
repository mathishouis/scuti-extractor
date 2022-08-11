<?php

namespace Holo5;

use Holo5\AssetExtractor\App\Builder\AssetBuilder;
use Holo5\AssetExtractor\App\Builder\FlippedAssetBuilder;
use Holo5\AssetExtractor\Domain\SWF;

require("vendor/autoload.php");

class Holo5Extractor
{
    public function __construct($args)
    {
        if(count($args) < 3) {
            throw new \Exception("Not enough arguments !");
        }

        $filePath = $args[1];
        $savePath = $args[2];

        $extractFlippedImages = isset($args[3]) && $args[3] === "--extract-flipped-images";

        $swf = new SWF($filePath);
        $swf->read();

        $assetBuilder = new AssetBuilder($savePath, $swf->symbols(), $swf->pngs(), $swf->binaries());
        $assetBuilder->buildAndSave();

        if($extractFlippedImages) {
            $flippedAssetBuilder = new FlippedAssetBuilder($savePath);
            $flippedAssetBuilder->extractFlippedImages();
        }

        echo PHP_EOL;
        echo "Done !\n";
    }
}

echo PHP_EOL;
echo "HOLO5 - Assets extractor \n";
echo "Made by Pi-Bouf (Pitt). https://github.com/Pi-Bouf/\n";
echo PHP_EOL;

try {
    new Holo5Extractor($argv);
} catch (\Exception $exception) {
    echo $exception->getMessage() . "\n";
}
