<?php

namespace Database\Seeders;

use App\Models\DealersPage;
use App\Models\DealerStep;
use Illuminate\Database\Seeder;

class DealersPageSeeder extends Seeder
{
    public function run(): void
    {
        DealersPage::create([
            'hero_title' => 'Наша продукция в вашем магазине',
            'hero_description' => 'Станьте официальным дилером БРИАРЕЙ — предлагайте клиентам сертифицированное оборудование для газодымоудаления с полной технической поддержкой от производителя',
            'hero_button_text' => 'Получить презентацию',
        ]);

        $steps = [
            ['sort_order' => 1, 'title' => 'Обмен информацией', 'description' => 'Вы рассказываете о вашей компании, мы — о продукции и условиях сотрудничества'],
            ['sort_order' => 2, 'title' => 'Считаем вашу выгоду', 'description' => 'Подготовим индивидуальное коммерческое предложение с дилерскими ценами'],
            ['sort_order' => 3, 'title' => 'Заключаем договор', 'description' => 'Оформляем партнёрство, предоставляем маркетинговые материалы и техническую поддержку'],
        ];

        foreach ($steps as $step) {
            DealerStep::create($step);
        }
    }
}
