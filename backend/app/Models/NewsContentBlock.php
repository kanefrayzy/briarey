<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsContentBlock extends Model
{
    protected $guarded = [];

    protected $casts = [
        'has_play_icon' => 'boolean',
        'is_reversed' => 'boolean',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}
