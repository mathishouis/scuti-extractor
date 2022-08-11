<?php

namespace Holo5\AssetExtractor\App\Builder;

class FlippedAssetBuilder
{
    private $savePath;

    public function __construct(string $savePath) {
        $this->savePath = $savePath;
    }

    public function extractFlippedImages(): void
    {
        echo "Extract flipped assets... \n";

        if(!is_dir($this->savePath . '/sprites') || !is_dir($this->savePath . '/binaries')) {
            throw new \Exception('No extracted images in folder.');
        }

        $assetsToExtract = $this->retrieveImageToFlip();
        if(count($assetsToExtract) === 0) return;

        foreach ($assetsToExtract as $destination => $source) {
            $strPosition = strpos($source, '32') !== false ? strpos($source, '32') : (strpos($source, '64') !== false ? strpos($source, '64') :
                false);

            if($strPosition === false) continue;

            $source = $this->savePath . '/sprites/' . substr($source, 0, $strPosition - 1) . '_' . $source . '.png';
            $destination = $this->savePath . '/sprites/' . substr($destination, 0, $strPosition - 1) . '_' . $destination . '.png';

            $this->flip($source, $destination);
        }
    }

    private function flip(string $source, string $destination): void {
        $im = imagecreatefrompng($source);
        imagealphablending($im, false);
        imagesavealpha($im, true);

        imageflip($im, IMG_FLIP_HORIZONTAL);
        imagepng($im, $destination);
        imagedestroy($im);
    }

    private function retrieveImageToFlip(): array {
        $fileName = null;
        $assetsToExtract = [];

        if ($handle = opendir($this->savePath . '/binaries')) {
            while (false !== ($entry = readdir($handle))) {
                if(strpos($entry, '_assets.bin')) {
                    $fileName = $entry;
                }
            }
            closedir($handle);
        }

        if($fileName !== null) {
            $assetsXML = new \SimpleXMLElement(file_get_contents($this->savePath . '/binaries/' . $fileName));
            foreach ($assetsXML as $asset) {
                if(isset($asset->attributes()['source'])) {
                    $assetsToExtract[(string) $asset->attributes()->name] = (string) $asset->attributes()['source'];
                }
            }
        }

        return $assetsToExtract;
    }
}