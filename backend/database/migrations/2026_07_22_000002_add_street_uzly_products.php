<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Добавляет узлы стыковочные уличного исполнения (ТЗ п.6) — данные со старого
     * сайта briarey.ru. Участвуют в калькуляторе при выборе «монтаж на уличную стену».
     * Идемпотентно: пропускает существующие slug.
     */
    public function up(): void
    {
        $category = DB::table('categories')->where('slug', 'uzel-stykovochnyj')->first();
        if (!$category) {
            return;
        }

        $attrs = DB::table('category_attributes')
            ->where('category_id', $category->id)
            ->pluck('id', 'key');

        $products = [
            [
                'slug' => 'uzel-stykovochnyj-vp-ui-300h300',
                'name' => 'Узел стыковочный СУ-ВП Бриарей УИ 300х300 мм (уличное исполнение)',
            ],
            [
                'slug' => 'uzel-stykovochnyj-v-ui-300h300',
                'name' => 'Узел стыковочный СУ-В Бриарей УИ 300х300 мм (уличное исполнение)',
            ],
        ];

        foreach ($products as $data) {
            if (DB::table('products')->where('slug', $data['slug'])->exists()) {
                continue;
            }

            $productId = DB::table('products')->insertGetId([
                'category_id' => $category->id,
                'slug'        => $data['slug'],
                'name'        => $data['name'],
                'badge'       => 'Монтаж во внешнюю перегородку (уличная стена)',
                'price'       => 25600,
                'sort_order'  => 0,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            $values = [
                'dimensions'      => '395х395 мм',
                'cut_dimensions'  => '300х300 мм',
                'fire_resistance' => 'EI 60',
                'weight'          => '5 кг',
            ];

            foreach ($values as $key => $value) {
                if (!isset($attrs[$key])) {
                    continue;
                }
                DB::table('product_attribute_values')->insert([
                    'product_id'            => $productId,
                    'category_attribute_id' => $attrs[$key],
                    'value'                 => $value,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        $ids = DB::table('products')
            ->whereIn('slug', ['uzel-stykovochnyj-vp-ui-300h300', 'uzel-stykovochnyj-v-ui-300h300'])
            ->pluck('id');

        DB::table('product_attribute_values')->whereIn('product_id', $ids)->delete();
        DB::table('products')->whereIn('id', $ids)->delete();
    }
};
