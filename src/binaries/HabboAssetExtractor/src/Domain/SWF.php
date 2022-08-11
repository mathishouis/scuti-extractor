<?php

namespace Holo5\AssetExtractor\Domain;

use Holo5\AssetExtractor\Domain\Asset\Binary;
use Holo5\AssetExtractor\Domain\Asset\PNG;
use Holo5\AssetExtractor\Domain\Asset\Symbol;

class SWF
{
    private $raw;
    private $pngs;
    private $symbols;
    private $binaries;

    public function __construct(string $swfPath)
    {
        $this->raw = file_get_contents($swfPath);

        if ($this->raw === false) throw new \Exception("SWF is empty or bad location !");

        if (substr($this->raw, 0, 3) == 'CWS') {
            $this->raw = 'F' . substr($this->raw, 1, 7) . gzuncompress(substr($this->raw, 8));
        }

        $this->symbols = [];
        $this->pngs = [];
        $this->binaries = [];
    }

    public function read()
    {
        echo "Rading SWF...\n";
        list(, $file_length) = unpack('V', substr($this->raw, 4, 4));

        $header_length = 8 + 1 + ceil(((ord($this->raw[8]) >> 3) * 4 - 3) / 8) + 4;

        for ($cursor = $header_length; $cursor < $file_length;) {
            list(, $tag_header) = unpack('v', substr($this->raw, $cursor, 2));
            $cursor += 2;

            list($tag_code, $tag_length) = [$tag_header >> 6, $tag_header & 0x3f];

            if ($tag_length == 0x3f) {
                list(, $tag_length) = unpack('V', substr($this->raw, $cursor, 4));
                $cursor += 4;
            }

            switch ($tag_code) {
                case 36:
                    $this->readPngs(substr($this->raw, $cursor, $tag_length));
                    break;

                case 76:
                    $this->readSymbols(substr($this->raw, $cursor, $tag_length));
                    break;

                case 87:
                    $this->readBinaries(substr($this->raw, $cursor, $tag_length));
                    break;
            }

            $cursor += $tag_length;
        }
    }

    private function readSymbols($raw)
    {
        list(, $number_of_symbols) = unpack('v', substr($raw, 0, 2));
        $raw = substr($raw, 2);
        for ($symbols = []; strlen($raw);) {
            $data = unpack('vsymbolId/Z*symbolValue', $raw);

            $this->symbols[] = new Symbol((int) $data["symbolId"], (string) $data["symbolValue"]);

            $raw = substr($raw, 2 + strlen($data["symbolValue"]) + 1);
        }
    }

    private function readBinaries($raw)
    {
        $length = strlen($raw) - 6;
        $data = unpack('vsymbolId/V/Z' . $length . 'data', $raw);
        $this->binaries[] = new Binary((int) $data["symbolId"], (string) $data["data"]);
    }

    private function readPngs($raw)
    {
        $tag = unpack('vsymbolId/Cformat/vwidth/vheight', $raw);
        $data = gzuncompress(substr($raw, 7));

        if ($tag['format'] != 5) return [];

        $im = imageCreateTrueColor($tag['width'], $tag['height']);
        $rectMask = imageColorAllocateAlpha($im, 255, 0, 255, 127);
        imageFill($im, 0, 0, $rectMask);
        $i = 0;
        for ($y = 0; $y < $tag['height']; $y++) {
            for ($x = 0; $x < $tag['width']; $x++) {
                $alpha = ord($data[$i++]);
                $alpha = 127 - $alpha / 2;
                $red   = ord($data[$i++]);
                $green = ord($data[$i++]);
                $blue  = ord($data[$i++]);
                $color = imageColorAllocateAlpha($im, $red, $green, $blue, $alpha);
                imageSetPixel($im, $x, $y, $color);
            }
        }
        imageSaveAlpha($im, true);
        $tag['im'] = $im;


        $this->pngs[] = new PNG((int) $tag['symbolId'], (int) $tag['format'], (int) $tag['width'], (int) $tag['height'], $tag['im']);
    }

    public function symbols(): array
    {
        return $this->symbols;
    }

    public function binaries(): array
    {
        return $this->binaries;
    }

    public function pngs(): array
    {
        return $this->pngs;
    }
}