<?php

namespace Database\Seeders;

use App\Models\Advantage;
use Illuminate\Database\Seeder;

class AdvantagesSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['sort_order' => 1, 'icon' => 'arrow', 'title' => 'Быстрая отгрузка 1–3 дня', 'description' => 'Большинство позиций в наличии на складе — отгружаем в течение 1–3 рабочих дней после оплаты счёта'],
            ['sort_order' => 2, 'icon' => 'shield', 'title' => 'Высокая надежность', 'description' => 'Продукция прошла все необходимые испытания, имеет сертификаты соответствия и допуски для установки на объектах любой категории'],
            ['sort_order' => 3, 'icon' => 'cpu', 'title' => 'Поддержка проектировщиков (Revit/AutoCAD)', 'description' => 'Предоставляем BIM-модели и блоки для Revit и AutoCAD — легко интегрировать оборудование в ваш проект'],
            ['sort_order' => 4, 'icon' => 'circle', 'title' => 'Инженерная консультация / нестандартные решения', 'description' => 'Подберём оборудование под ваш объект, рассчитаем параметры и предложим оптимальную комплектацию'],
        ];

        foreach ($items as $item) {
            Advantage::create($item);
        }
    }
}
