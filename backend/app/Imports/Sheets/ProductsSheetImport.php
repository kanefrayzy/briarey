<?php

namespace App\Imports\Sheets;

use App\Models\Product;
use App\Models\Category;
use App\Imports\ImportResults;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class ProductsSheetImport implements ToModel, WithHeadingRow
{
    protected ImportResults $results;
    protected array $categoryMap;

    public function __construct(ImportResults $results)
    {
        $this->results = $results;
        $this->results->set('products', ['updated' => 0, 'created' => 0, 'errors' => []]);
        $this->categoryMap = Category::pluck('id', 'name')->toArray();
    }

    public function model(array $row)
    {
        $name = trim($row['nazvanie'] ?? '');
        if (!$name) {
            return null;
        }

        $categoryId = $this->categoryMap[$row['kategoriia'] ?? ''] ?? null;
        $id = $row['id'] ?? null;

        $price = $row['cena_rub'] ?? 0;

        $data = [
            'name'               => $name,
            'slug'               => $row['slug'] ?? Str::slug($name),
            'badge'              => !empty($row['sildik']) ? $row['sildik'] : null,
            'price'              => (int) $price,
            'calculator_hint'    => !empty($row['podskazka_kalkuliatora']) ? $row['podskazka_kalkuliatora'] : null,
            'technical_doc_url'  => !empty($row['tex_dokumentaciia_url']) ? $row['tex_dokumentaciia_url'] : null,
            'is_active'          => mb_strtolower(trim($row['aktiven_danet'] ?? 'да')) === 'да',
        ];

        if ($categoryId) {
            $data['category_id'] = $categoryId;
        }

        if ($id && Product::where('id', $id)->exists()) {
            Product::where('id', $id)->update($data);
            $this->results->increment('products', 'updated');
        } else {
            if (!$categoryId) {
                $this->results->addError('products', "«{$name}»: категория не найдена");
                return null;
            }
            $data['category_id'] = $categoryId;
            Product::create($data);
            $this->results->increment('products', 'created');
        }

        return null;
    }
}
