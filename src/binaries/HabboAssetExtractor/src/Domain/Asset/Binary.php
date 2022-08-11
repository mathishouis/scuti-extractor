<?php

namespace Holo5\AssetExtractor\Domain\Asset;

class Binary
{
    private $id;
    private $data;

    public function __construct(int $id, string $data)
    {
        $this->id = $id;
        $this->data = $data;
    }

    public function id(): int
    {
        return $this->id;
    }

    public function data(): string
    {
        return $this->data;
    }

}