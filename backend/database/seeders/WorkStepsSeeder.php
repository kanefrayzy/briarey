<?php

namespace Database\Seeders;

use App\Models\WorkStep;
use Illuminate\Database\Seeder;

class WorkStepsSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['sort_order' => 1, 'title' => 'Подбор оборудования', 'description' => 'Определяем задачу, параметры объекта и подбираем подходящую конфигурацию оборудования'],
            ['sort_order' => 2, 'title' => 'Коммерческое предложение', 'description' => 'Формируем смету с ценами, сроками поставки. описанием комплектации'],
            ['sort_order' => 3, 'title' => 'Производство и комплектация', 'description' => 'Изготавливаем и собираем оборудование, проводим контроль качества'],
            ['sort_order' => 4, 'title' => 'Отгрузка и доставка по РФ', 'description' => 'Отправляем транспортной компанией по всей России, предоставим трекинг и документы'],
        ];

        foreach ($items as $item) {
            WorkStep::create($item);
        }
    }
}
