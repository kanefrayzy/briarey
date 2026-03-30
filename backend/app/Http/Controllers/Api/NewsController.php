<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::where('is_published', true)->orderByDesc('date');

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = $request->integer('per_page', 12);
        $news = $query->paginate($perPage);

        return response()->json($news);
    }

    public function show(string $slug)
    {
        $news = News::where('slug', $slug)
            ->where('is_published', true)
            ->with(['contentBlocks' => fn ($q) => $q->orderBy('sort_order')])
            ->firstOrFail();

        return response()->json($news);
    }
}
