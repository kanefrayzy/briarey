<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    public function run(): void
    {
        HeroSection::create([
            'title' => 'Системы газодымоудаления',
            'subtitle' => 'Производство и продажа',
            'cta_text' => 'Подробнее',
            'cta_link' => '/catalog',
            'card_title' => 'Подбор комплекта за 2 минуты',
            'card_description' => 'Настройте конфигурацию оборудования под ваш объект с помощью онлайн-калькулятора',
            'card_button_text' => 'Калькулятор',
            'card_button_link' => '/calculator',
        ]);
    }
}
