<?php

namespace App\Imports\Sheets;

use App\Models\ProductCompositionItem;
use App\Imports\ImportResults;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CompositionSheetImport implements ToModel, WithHeadingRow
{
    protected ImportResults $results;

    public function __construct(ImportResults $results)
    {
        $this->results = $results;
        $this->results->set('composition', ['updated' => 0, 'created' => 0, 'errors' => []]);
    }

    public function model(array $row)
    {
        $text      = trim($row['tekst'] ?? '');
        $id        = $row['id'] ?? null;
        $productId = $row['id_tovara'] ?? null;

        if (!$text) {
            return null;
        }

        $data = [
            'text'       => $text,
            'sort_order' => (int) ($row['poriadok'] ?? 0),
        ];

        if ($id && ProductCompositionItem::where('id', $id)->exists()) {
            ProductCompositionItem::where('id', $id)->update($data);
            $this->results->increment('composition', 'updated');
        } elseif ($productId) {
            $data['product_id'] = (int) $productId;
            ProductCompositionItem::create($data);
            $this->results->increment('composition', 'created');
        } else {
            $this->results->addError('composition', "«{$text}»: не указан ID товара");
        }

        return null;
    }
}
