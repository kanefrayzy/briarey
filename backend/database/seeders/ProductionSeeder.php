<?php

namespace Database\Seeders;

use App\Models\ProductionSection;
use App\Models\ProductionFeature;
use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        ProductionSection::create([
            'title' => 'Собственное производство',
            'subtitle' => 'полного цикла',
            'button_text' => 'О компании',
            'button_link' => '/about',
        ]);

        $features = [
            ['sort_order' => 1, 'title' => 'ISO 9001', 'description' => 'Сертифицированная система менеджмента качества'],
            ['sort_order' => 2, 'title' => '20 лет на рынке', 'description' => 'Опыт разработки и производства систем безопасности'],
            ['sort_order' => 3, 'title' => 'Патенты и сертификация', 'description' => 'Собственные разработки, защищённые патентами РФ'],
        ];

        foreach ($features as $feature) {
            ProductionFeature::create($feature);
        }
    }
}
