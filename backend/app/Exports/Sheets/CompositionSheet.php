<?php

namespace App\Exports\Sheets;

use App\Models\ProductCompositionItem;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CompositionSheet implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, WithColumnWidths
{
    public function query()
    {
        return ProductCompositionItem::with('product')
            ->orderBy('product_id')
            ->orderBy('sort_order');
    }

    public function headings(): array
    {
        return [
            'ID',
            'ID товара',
            'Товар',
            'Текст',
            'Порядок',
        ];
    }

    public function map($item): array
    {
        return [
            $item->id,
            $item->product_id,
            $item->product?->name ?? '',
            $item->text,
            $item->sort_order,
        ];
    }

    public function title(): string
    {
        return 'Состав';
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
            'D' => 50,
            'E' => 10,
        ];
    }
}
