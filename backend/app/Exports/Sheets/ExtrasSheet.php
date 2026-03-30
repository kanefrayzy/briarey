<?php

namespace App\Exports\Sheets;

use App\Models\ProductExtra;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExtrasSheet implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, WithColumnWidths
{
    public function query()
    {
        return ProductExtra::with('product')
            ->orderBy('product_id')
            ->orderBy('sort_order');
    }

    public function headings(): array
    {
        return [
            'ID доп. оборудования',
            'ID товара',
            'Товар',
            'Название',
            'Описание',
            'Цена (₽)',
            'Изображение',
            'Порядок',
        ];
    }

    public function map($extra): array
    {
        return [
            $extra->id,
            $extra->product_id,
            $extra->product?->name ?? '',
            $extra->name,
            $extra->description ?? '',
            $extra->price,
            $extra->image ?? '',
            $extra->sort_order,
        ];
    }

    public function title(): string
    {
        return 'Доп оборудование';
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
            'C' => 40,
            'D' => 45,
            'E' => 30,
            'F' => 12,
            'G' => 30,
            'H' => 10,
        ];
    }
}
