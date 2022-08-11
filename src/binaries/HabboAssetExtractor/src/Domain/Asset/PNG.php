<?php

namespace Holo5\AssetExtractor\Domain\Asset;

class PNG
{
    private $id;
    private $format;
    private $width;
    private $height;
    private $im;

    public function __construct(int $id, int $format, int $width, int $height, $im)
    {
        $this->id = $id;
        $this->format = $format;
        $this->width = $width;
        $this->height = $height;
        $this->im = $im;
    }

    public function Id(): int
    {
        return $this->id;
    }

    public function format(): int
    {
        return $this->format;
    }

    public function width(): int
    {
        return $this->width;
    }

    public function height(): int
    {
        return $this->height;
    }

    public function im()
    {
        return $this->im;
    }

    public function toArray() {
        return [
            "width" => $this->width,
            "height" => $this->height,
            "format" => $this->format,
            "im" => $this->im
        ];
    }
}