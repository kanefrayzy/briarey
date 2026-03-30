<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\SkipsUnknownSheets;

class ProductsImport implements WithMultipleSheets, SkipsUnknownSheets
{
    protected ImportResults $results;

    public function __construct()
    {
        $this->results = new ImportResults();
    }

    public function sheets(): array
    {
        return [
            'Товары'           => new Sheets\ProductsSheetImport($this->results),
            'Доп оборудование' => new Sheets\ExtrasSheetImport($this->results),
            'Характеристики'   => new Sheets\AttributesSheetImport($this->results),
            'Состав'           => new Sheets\CompositionSheetImport($this->results),
        ];
    }

    public function onUnknownSheet($sheetName): void
    {
        // Ignore unexpected sheets
    }

    public function getResults(): ImportResults
    {
        return $this->results;
    }
}
