<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\CertificatesPage;

class CertificateController extends Controller
{
    public function index()
    {
        return response()->json([
            'page' => CertificatesPage::first(),
            'certificates' => Certificate::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
