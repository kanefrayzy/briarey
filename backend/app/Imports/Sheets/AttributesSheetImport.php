<?php

namespace App\Imports\Sheets;

use App\Models\ProductAttributeValue;
use App\Imports\ImportResults;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AttributesSheetImport implements ToModel, WithHeadingRow
{
    protected ImportResults $results;

    public function __construct(ImportResults $results)
    {
        $this->results = $results;
        $this->results->set('attributes', ['updated' => 0, 'errors' => []]);
    }

    public function model(array $row)
    {
        $id    = $row['id_xarakteristiki'] ?? null;
        $value = trim($row['znacenie'] ?? '');

        if (!$id || $value === '') {
            return null;
        }

        if (ProductAttributeValue::where('id', $id)->exists()) {
            ProductAttributeValue::where('id', $id)->update(['value' => $value]);
            $this->results->increment('attributes', 'updated');
        } else {
            $this->results->addError('attributes', "Характеристика ID={$id} не найдена");
        }

        return null;
    }
}
