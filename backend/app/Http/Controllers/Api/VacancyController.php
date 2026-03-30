<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use App\Models\VacanciesPage;

class VacancyController extends Controller
{
    public function index()
    {
        return response()->json([
            'page' => VacanciesPage::first(),
            'vacancies' => Vacancy::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
