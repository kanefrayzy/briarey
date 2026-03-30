<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function attributeValues(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function compositionItems(): HasMany
    {
        return $this->hasMany(ProductCompositionItem::class)->orderBy('sort_order');
    }

    public function starterKitItems(): HasMany
    {
        return $this->hasMany(ProductStarterKitItem::class)->orderBy('sort_order');
    }

    public function mainSpecs(): HasMany
    {
        return $this->hasMany(ProductMainSpec::class)->orderBy('sort_order');
    }

    public function extras(): HasMany
    {
        return $this->hasMany(ProductExtra::class)->orderBy('sort_order');
    }
}
