<?php

namespace App\Imports\Sheets;

use App\Models\ProductExtra;
use App\Imports\ImportResults;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ExtrasSheetImport implements ToModel, WithHeadingRow
{
    protected ImportResults $results;

    public function __construct(ImportResults $results)
    {
        $this->results = $results;
        $this->results->set('extras', ['updated' => 0, 'created' => 0, 'errors' => []]);
    }

    public function model(array $row)
    {
        $name = trim($row['nazvanie'] ?? '');
        if (!$name) {
            return null;
        }

        $id        = $row['id_dop_oborudovaniia'] ?? null;
        $productId = $row['id_tovara'] ?? null;
        $price     = $row['cena_rub'] ?? 0;

        $data = [
            'name'        => $name,
            'description' => $row['opisanie'] ?? '',
            'price'       => (int) $price,
            'sort_order'  => (int) ($row['poriadok'] ?? 0),
        ];

        if ($id && ProductExtra::where('id', $id)->exists()) {
            ProductExtra::where('id', $id)->update($data);
            $this->results->increment('extras', 'updated');
        } elseif ($productId) {
            $data['product_id'] = (int) $productId;
            ProductExtra::create($data);
            $this->results->increment('extras', 'created');
        } else {
            $this->results->addError('extras', "«{$name}»: не указан ID товара");
        }

        return null;
    }
}
