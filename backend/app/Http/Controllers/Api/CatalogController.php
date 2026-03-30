<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;

class CatalogController extends Controller
{
    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function categoryProducts(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['attributes' => fn ($q) => $q->orderBy('sort_order')])
            ->firstOrFail();

        $products = $category->products()
            ->where('is_active', true)
            ->with(['attributeValues.categoryAttribute'])
            ->get();

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'category',
                'images' => fn ($q) => $q->orderBy('sort_order'),
                'compositionItems' => fn ($q) => $q->orderBy('sort_order'),
                'starterKitItems' => fn ($q) => $q->orderBy('sort_order'),
                'mainSpecs' => fn ($q) => $q->orderBy('sort_order'),
                'mainSpecs.columns' => fn ($q) => $q->orderBy('sort_order'),
                'extras' => fn ($q) => $q->orderBy('sort_order'),
                'attributeValues.categoryAttribute',
            ])
            ->firstOrFail();

        return response()->json($product);
    }

    public function products(\Illuminate\Http\Request $request)
    {
        $query = Product::where('is_active', true)->with(['category', 'attributeValues.categoryAttribute']);

        if ($slug = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $products = $query->orderBy('name')->limit(12)->get();

        return response()->json($products);
    }

    public function search(\Illuminate\Http\Request $request)
    {
        $q = $request->input('q', '');
        if (mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $products = Product::where('is_active', true)
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('badge', 'like', "%{$q}%");
            })
            ->with('category')
            ->limit(8)
            ->get(['id', 'slug', 'name', 'price', 'image', 'category_id']);

        return response()->json($products);
    }
}
