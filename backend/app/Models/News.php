<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class News extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function contentBlocks(): HasMany
    {
        return $this->hasMany(NewsContentBlock::class)->orderBy('sort_order');
    }
}
