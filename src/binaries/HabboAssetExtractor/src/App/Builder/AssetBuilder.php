<?php

namespace Holo5\AssetExtractor\App\Builder;

use Holo5\AssetExtractor\Domain\Asset\Symbol;

class AssetBuilder
{
    private $savePath;
    private $symbols;
    private $pngs;
    private $binaries;

    public function __construct(string $savePath, array $symbols, array $pngs, array $binaries)
    {
        if (!is_dir($savePath)) {
            mkdir($savePath, 0777, true);
        }

        $this->savePath = $savePath;
        $this->symbols = $symbols;
        $this->pngs = $pngs;
        $this->binaries = $binaries;
    }

    public function buildAndSave()
    {
        echo "Building assets... \n";
        $this->buildPngs();
        $this->buildBinaries();
    }

    private function buildPngs()
    {
        echo "Building PNGS... \n";

        if(!is_dir($this->savePath . "/sprites")) {
            mkdir($this->savePath . "/sprites");
        }

        $savePath = realpath($this->savePath . "/" . "sprites");

        foreach ($this->symbols as $symbol) {
            $pngId = $symbol->id();
            $pngs = array_filter($this->pngs, function ($searched) use ($pngId) {
                return $searched->id() == $pngId;
            });

            if (count($pngs) == 1) {
                $png = array_shift($pngs);
                $pngData = $png->toArray();

                ob_start();
                imagepng($pngData['im']);
                $image_data = ob_get_contents();
                ob_end_clean();

                file_put_contents($savePath.'/'.$symbol->value().'.png', $image_data);
            }
        }
    }

    private function buildBinaries()
    {
        echo "Building binaries... \n";

        if(!is_dir($this->savePath . "/binaries")) {
            mkdir($this->savePath . "/binaries");
        }

        $savePath = realpath($this->savePath . "/" . "binaries");

        /**
         * @var Symbol $symbol
         */
        foreach ($this->symbols as $symbol) {
            $binaryId = $symbol->id();
            $binaries = array_filter($this->binaries, function ($searched) use ($binaryId) {
                return $searched->id() == $binaryId;
            });

            if(count($binaries) === 1) {
                $xml = array_shift($binaries);

                file_put_contents($savePath.'/'.$symbol->value().'.bin', $xml->data());
            }
        }
    }
}