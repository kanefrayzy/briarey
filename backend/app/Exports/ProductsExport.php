<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductsExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Товары'             => new Sheets\ProductsSheet(),
            'Доп оборудование'   => new Sheets\ExtrasSheet(),
            'Характеристики'     => new Sheets\AttributesSheet(),
            'Состав'             => new Sheets\CompositionSheet(),
        ];
    }
}
