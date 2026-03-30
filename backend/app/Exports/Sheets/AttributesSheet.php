<?php

namespace App\Exports\Sheets;

use App\Models\ProductAttributeValue;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttributesSheet implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, WithColumnWidths
{
    public function query()
    {
        return ProductAttributeValue::with(['product', 'categoryAttribute'])
            ->orderBy('product_id')
            ->orderBy('category_attribute_id');
    }

    public function headings(): array
    {
        return [
            'ID характеристики',
            'ID товара',
            'Товар',
            'Характеристика',
            'Значение',
        ];
    }

    public function map($value): array
    {
        return [
            $value->id,
            $value->product_id,
            $value->product?->name ?? '',
            $value->categoryAttribute?->name ?? '',
            $value->value,
        ];
    }

    public function title(): string
    {
        return 'Характеристики';
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 10,
            'C' => 45,
            'D' => 30,
            'E' => 30,
        ];
    }
}
