<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCompositionItem;
use App\Models\ProductExtra;
use App\Models\ProductMainSpec;
use App\Models\ProductMainSpecColumn;
use App\Models\ProductStarterKitItem;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        /* ── Категории ─────────────────────────────────────────── */

        $categories = [
            ['sort_order' => 1, 'name' => 'Узел стыковочный',              'slug' => 'uzel-stykovochnyj'],
            ['sort_order' => 2, 'name' => 'Клапана сброса',                'slug' => 'klapana-sbrosa'],
            ['sort_order' => 3, 'name' => 'Дымососы',                      'slug' => 'dymososy'],
            ['sort_order' => 4, 'name' => 'Доп. оборудование',             'slug' => 'dop-oborudovanie'],
            ['sort_order' => 5, 'name' => 'Шкафы для хранения',            'slug' => 'shkafy-dlya-hraneniya'],
            ['sort_order' => 6, 'name' => 'Двери противопожарные',         'slug' => 'dveri-protivopozharnye'],
            ['sort_order' => 7, 'name' => 'Установки сбора вещества',      'slug' => 'ustanovki-sbora-veshchestva'],
            ['sort_order' => 8, 'name' => 'Дымососы для пожарных машин',   'slug' => 'dymososy-dlya-pozharnyh-mashin'],
        ];

        $created = [];
        foreach ($categories as $cat) {
            $created[$cat['slug']] = Category::create(array_merge($cat, ['is_active' => true]));
        }

        $dymososy = $created['dymososy'];

        /* ── Товар 1: ДПЭ-7 ───────────────────────────────────── */

        $p1 = Product::create([
            'category_id'     => $dymososy->id,
            'slug'            => 'dymosos-dpe-7',
            'name'            => 'Дымосос ДПЭ-7 (1ЦМ) ДПЭ-А-К-2,0',
            'badge'           => 'Газо- и дымоудаление после ПТ • среда до 120°C',
            'price'           => 48500,
            'calculator_hint' => 'Если условия нестандартные или требуется расчёт под несколько помещений — воспользуйтесь калькулятором подбора.',
            'is_active'       => true,
        ]);

        $this->seedDPE7($p1);

        /* ── Товар 2: ДПЭ-8 ───────────────────────────────────── */

        $p2 = Product::create([
            'category_id'     => $dymososy->id,
            'slug'            => 'dymosos-dpe-8',
            'name'            => 'Дымосос ДПЭ-8 (2ЦМ) ДПЭ-А-К-3,0',
            'badge'           => 'Газо- и дымоудаление после ПТ • среда до 140°C',
            'price'           => 58500,
            'calculator_hint' => 'Если условия нестандартные или требуется расчёт под несколько помещений — воспользуйтесь калькулятором подбора.',
            'is_active'       => true,
        ]);

        $this->seedDPE8($p2);
    }

    /* ── Наполнение ДПЭ-7 ──────────────────────────────────────── */

    private function seedDPE7(Product $product): void
    {
        // Состав комплекта
        foreach ([
            '+ рукав всасывающий — 5 м',
            '+ рукав напорный — 10 м',
        ] as $i => $text) {
            ProductCompositionItem::create([
                'product_id' => $product->id,
                'text'       => $text,
                'sort_order' => $i + 1,
            ]);
        }

        // Стартовый комплект
        $kit = [
            ['name' => 'Дымосос (основной товар)', 'description' => "Производительность: от 1500 м³/час.\nКол-во в наборе: 1 шт.", 'qty' => '1 шт.'],
            ['name' => 'Рукав всасывающий РВ',     'description' => "Длина рукава: 5 м\nКол-во в наборе: 1 шт.",                    'qty' => '5 м'],
            ['name' => 'Рукав напорный РН',         'description' => "Длина рукава: 10 м\nКол-во в наборе: 1 шт.",                   'qty' => '10 м'],
        ];
        foreach ($kit as $i => $item) {
            ProductStarterKitItem::create(array_merge($item, [
                'product_id' => $product->id,
                'sort_order' => $i + 1,
            ]));
        }

        // Основные спецификации — «Назначение»
        $spec = ProductMainSpec::create([
            'product_id' => $product->id,
            'title'      => 'Назначение',
            'sort_order' => 1,
        ]);

        $columns = [
            [
                'heading' => 'Основное назначение:',
                'content' => [
                    'Снижение концентрации огнетушащего вещества,',
                    'снижение температуры дымовоздушной среды,',
                    'нормализация воздушной среды после срабатывания',
                    'системы пожаротушения.',
                ],
            ],
            [
                'heading' => 'Дополнительное применение:',
                'content' => ['Нормализация воздушной среды при проведении сварочных работ.'],
            ],
            [
                'heading' => 'Варианты изготовления:',
                'content' => [
                    '• Общего назначения – из углеродистой стали с',
                    'полимерным покрытием.',
                    '• Коррозионностойкий – из нержавеющей стали',
                    'марки 08X18H10.',
                ],
            ],
        ];
        foreach ($columns as $i => $col) {
            ProductMainSpecColumn::create([
                'product_main_spec_id' => $spec->id,
                'heading'              => $col['heading'],
                'content'              => $col['content'],
                'sort_order'           => $i + 1,
            ]);
        }

        // Доп. оборудование
        $extras = [
            ['name' => 'Стартовый комплект',        'description' => 'Стартовый комплект. Длина рукавов может быть изменена ниже', 'price' => 12000],
            ['name' => 'Рукав всасывающий — 5 м',   'description' => 'Дополнительный рукав для увеличения зоны работы',           'price' => 3500],
            ['name' => 'Рукав напорный — 10 м',     'description' => 'Дополнительный напорный рукав',                             'price' => 4200],
        ];
        foreach ($extras as $i => $extra) {
            ProductExtra::create(array_merge($extra, [
                'product_id' => $product->id,
                'sort_order' => $i + 1,
            ]));
        }
    }

    /* ── Наполнение ДПЭ-8 ──────────────────────────────────────── */

    private function seedDPE8(Product $product): void
    {
        // Состав комплекта
        foreach ([
            '+ рукав всасывающий — 5 м',
            '+ рукав напорный — 10 м',
            '+ рукав напорный — 10 м',
        ] as $i => $text) {
            ProductCompositionItem::create([
                'product_id' => $product->id,
                'text'       => $text,
                'sort_order' => $i + 1,
            ]);
        }

        // Стартовый комплект
        $kit = [
            ['name' => 'Дымосос (основной товар)', 'description' => "Производительность: от 2200 м³/час.\nКол-во в наборе: 1 шт.", 'qty' => '1 шт.'],
            ['name' => 'Рукав всасывающий РВ',     'description' => "Длина рукава: 5 м\nКол-во в наборе: 1 шт.",                    'qty' => '5 м'],
            ['name' => 'Рукав напорный РН',         'description' => "Длина рукава: 10 м\nКол-во в наборе: 1 шт.",                   'qty' => '10 м'],
        ];
        foreach ($kit as $i => $item) {
            ProductStarterKitItem::create(array_merge($item, [
                'product_id' => $product->id,
                'sort_order' => $i + 1,
            ]));
        }

        // Основные спецификации — «Назначение»
        $spec = ProductMainSpec::create([
            'product_id' => $product->id,
            'title'      => 'Назначение',
            'sort_order' => 1,
        ]);

        $columns = [
            [
                'heading' => 'Основное назначение:',
                'content' => [
                    'Снижение концентрации огнетушащего вещества,',
                    'снижение температуры дымовоздушной среды,',
                    'нормализация воздушной среды после срабатывания',
                    'системы пожаротушения.',
                ],
            ],
            [
                'heading' => 'Дополнительное применение:',
                'content' => ['Нормализация воздушной среды при проведении сварочных работ.'],
            ],
            [
                'heading' => 'Варианты изготовления:',
                'content' => [
                    '• Общего назначения – из углеродистой стали с',
                    'полимерным покрытием.',
                    '• Коррозионностойкий – из нержавеющей стали',
                    'марки 08X18H10.',
                ],
            ],
        ];
        foreach ($columns as $i => $col) {
            ProductMainSpecColumn::create([
                'product_main_spec_id' => $spec->id,
                'heading'              => $col['heading'],
                'content'              => $col['content'],
                'sort_order'           => $i + 1,
            ]);
        }

        // Доп. оборудование
        $extras = [
            ['name' => 'Стартовый комплект',        'description' => 'Стартовый комплект. Длина рукавов может быть изменена ниже', 'price' => 14000],
            ['name' => 'Рукав всасывающий — 5 м',   'description' => 'Дополнительный рукав для увеличения зоны работы',           'price' => 3800],
            ['name' => 'Рукав напорный — 10 м',     'description' => 'Дополнительный напорный рукав',                             'price' => 4500],
        ];
        foreach ($extras as $i => $extra) {
            ProductExtra::create(array_merge($extra, [
                'product_id' => $product->id,
                'sort_order' => $i + 1,
            ]));
        }
    }
}
