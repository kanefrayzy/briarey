<?php

namespace Database\Seeders;

use App\Models\SmartPickSection;
use Illuminate\Database\Seeder;

class SmartPickSeeder extends Seeder
{
    public function run(): void
    {
        SmartPickSection::create([
            'title' => 'Умный подбор оборудования',
            'description' => 'Настройте параметры объекта — калькулятор автоматически подберёт подходящее оборудование и рассчитает стоимость комплекта',
            'button_text' => 'Подобрать оборудование',
            'button_link' => '/calculator',
        ]);
    }
}
