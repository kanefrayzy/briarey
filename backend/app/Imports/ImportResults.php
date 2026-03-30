<?php

namespace App\Imports;

class ImportResults
{
    protected array $data = [];

    public function set(string $key, array $value): void
    {
        $this->data[$key] = $value;
    }

    public function get(string $key): array
    {
        return $this->data[$key] ?? [];
    }

    public function increment(string $sheet, string $counter): void
    {
        if (!isset($this->data[$sheet][$counter])) {
            $this->data[$sheet][$counter] = 0;
        }
        $this->data[$sheet][$counter]++;
    }

    public function addError(string $sheet, string $message): void
    {
        $this->data[$sheet]['errors'][] = $message;
    }

    public function all(): array
    {
        return $this->data;
    }
}
