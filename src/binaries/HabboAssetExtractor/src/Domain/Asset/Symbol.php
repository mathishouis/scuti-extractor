<?php

namespace Holo5\AssetExtractor\Domain\Asset;

class Symbol
{
    private $id;
    private $value;

    public function __construct(int $id, string $value)
    {
        $this->id = $id;
        $this->value = $value;
    }

    public function id(): int
    {
        return $this->id;
    }

    public function value(): string
    {
        return $this->value;
    }


}