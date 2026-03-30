<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DealersPage;
use App\Models\DealerStep;

class DealerController extends Controller
{
    public function index()
    {
        return response()->json([
            'page' => DealersPage::first(),
            'steps' => DealerStep::orderBy('sort_order')->get(),
        ]);
    }
}
