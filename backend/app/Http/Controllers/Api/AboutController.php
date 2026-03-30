<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use App\Models\AboutPhoto;

class AboutController extends Controller
{
    public function index()
    {
        return response()->json([
            'page' => AboutPage::first(),
            'photos' => AboutPhoto::orderBy('sort_order')->get(),
        ]);
    }
}
