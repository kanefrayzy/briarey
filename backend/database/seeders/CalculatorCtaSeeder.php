<?php

namespace Database\Seeders;

use App\Models\CalculatorCta;
use Illuminate\Database\Seeder;

class CalculatorCtaSeeder extends Seeder
{
    public function run(): void
    {
        CalculatorCta::create([
            'title' => 'Подбор комплекта',
            'title_highlight' => 'за 2 минуты',
            'description' => 'Настройте конфигурацию оборудования под ваш объект с помощью онлайн-калькулятора — быстро, точно и без ожидания ответа менеджера',
            'button_text' => 'Калькулятор',
            'button_link' => '/calculator',
        ]);
    }
}
