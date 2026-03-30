<?php

namespace App\Exports\Sheets;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductsSheet implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, WithColumnWidths
{
    public function query()
    {
        return Product::with('category')->orderBy('category_id')->orderBy('name');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Категория',
            'Название',
            'Slug',
            'Шильдик',
            'Цена (₽)',
            'Изображение',
            'Подсказка калькулятора',
            'Тех. документация (URL)',
            'Активен (да/нет)',
        ];
    }

    public function map($product): array
    {
        return [
            $product->id,
            $product->category?->name ?? '',
            $product->name,
            $product->slug,
            $product->badge ?? '',
            $product->price,
            $product->image ?? '',
            $product->calculator_hint ?? '',
            $product->technical_doc_url ?? '',
            $product->is_active ? 'да' : 'нет',
        ];
    }

    public function title(): string
    {
        return 'Товары';
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
            'A' => 6,
            'B' => 20,
            'C' => 45,
            'D' => 30,
            'E' => 15,
            'F' => 12,
            'G' => 30,
            'H' => 25,
            'I' => 30,
            'J' => 14,
        ];
    }
}
