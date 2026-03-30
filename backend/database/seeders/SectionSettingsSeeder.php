<?php

namespace Database\Seeders;

use App\Models\SectionSetting;
use Illuminate\Database\Seeder;

class SectionSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            ['section_key' => 'advantages', 'title' => 'Почему выбирают нас', 'subtitle' => ''],
            ['section_key' => 'work_steps', 'title' => 'Схема работы', 'subtitle' => ''],
            ['section_key' => 'partners', 'title' => 'Работаем с клиентами', 'subtitle' => ''],
            ['section_key' => 'production', 'title' => 'Собственное производство', 'subtitle' => ''],
            ['section_key' => 'faq', 'title' => 'Ответы на часто задаваемые вопросы', 'subtitle' => ''],
            ['section_key' => 'news', 'title' => 'Новости компании', 'subtitle' => ''],
            ['section_key' => 'catalog', 'title' => 'Каталог продукции', 'subtitle' => ''],
        ];

        foreach ($sections as $section) {
            SectionSetting::create($section);
        }
    }
}
