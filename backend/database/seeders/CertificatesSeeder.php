<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\CertificatesPage;
use Illuminate\Database\Seeder;

class CertificatesSeeder extends Seeder
{
    public function run(): void
    {
        CertificatesPage::create([
            'hero_title' => 'Сертификаты и лицензии',
            'hero_description' => 'Наша продукция prошла все необходимые испытания и имеет сертификаты соответствия',
        ]);

        $titles = [
            'Сертификат соответствия ГОСТ Р',
            'Сертификат пожарной безопасности',
            'Декларация о соответствии ТР ЕАЭС',
            'Сертификат ISO 9001:2015',
            'Свидетельство о допуске СРО',
            'Лицензия МЧС',
        ];

        foreach ($titles as $i => $title) {
            Certificate::create([
                'sort_order' => $i + 1,
                'title' => $title,
                'is_active' => true,
            ]);
        }
    }
}
