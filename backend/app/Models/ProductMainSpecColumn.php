<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductMainSpecColumn extends Model
{
    protected $guarded = [];

    protected $casts = [
        'content' => 'array',
    ];

    public function mainSpec(): BelongsTo
    {
        return $this->belongsTo(ProductMainSpec::class, 'product_main_spec_id');
    }
}
