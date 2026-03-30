<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\HeroSection;
use App\Models\SmartPickSection;
use App\Models\SectionSetting;
use App\Models\Advantage;
use App\Models\WorkStep;
use App\Models\Partner;
use App\Models\ProductionFeature;
use App\Models\ProductionSection;
use App\Models\Faq;
use App\Models\CalculatorCta;
use App\Models\Slide;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'site_settings' => SiteSetting::first(),
            'hero' => HeroSection::first(),
            'slides' => Slide::where('is_active', true)->orderBy('sort_order')->get(),
            'smart_pick' => SmartPickSection::first(),
            'section_settings' => SectionSetting::all()->keyBy('section_key'),
            'advantages' => Advantage::orderBy('sort_order')->get(),
            'work_steps' => WorkStep::orderBy('sort_order')->get(),
            'partners' => Partner::where('is_active', true)->orderBy('sort_order')->get(),
            'production_section' => ProductionSection::first(),
            'production_features' => ProductionFeature::orderBy('sort_order')->get(),
            'faqs' => Faq::where('is_active', true)->orderBy('sort_order')->get(),
            'calculator_cta' => CalculatorCta::first(),
        ]);
    }

    public function siteSettings()
    {
        return response()->json(SiteSetting::first());
    }
}
