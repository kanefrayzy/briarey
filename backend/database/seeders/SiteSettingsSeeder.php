<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::create([
            'phone_1' => '8 (800) 201-85-88',
            'phone_2' => '8 (916) 707-57-77',
            'email' => 'info@briarey.ru',
            'work_hours' => 'ПН–ПТ 8:00–17:00',
            'address' => 'Московская обл., г. Раменское',
            'company_name' => 'ООО «БРИАРЕЙ»',
            'inn' => '5040108803',
            'ogrn' => '1115040008016',
            'okpo' => '92662134',
            'facebook_url' => '#',
            'youtube_url' => '#',
            'instagram_url' => '#',
            'twitter_url' => '#',
        ]);
    }
}
