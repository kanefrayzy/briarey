<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * По ТЗ правок калькулятора:
     *  - п.5: убрать из каталога дымососы ДПЭ-7 (2,5ЦМ) и (2,5Ц) — деактивируем,
     *    из подбора калькулятора они исключены новой таблицей;
     *  - п.4: в составе стартового комплекта картинку «Рукав всасывающий»
     *    заменить на фото товара «Рукав всасывающий дополнительный РВ».
     */
    public function up(): void
    {
        DB::table('products')
            ->whereIn('slug', [
                'dymosos-dpje-7-25cm-dpje-a-k-25-2000',
                'dymosos-dpje-7-25c-dpje-a-p-25-2000',
            ])
            ->update(['is_active' => false]);

        DB::table('product_starter_kit_items')
            ->where('image', 'products/rukav-vsasyvajushhii-dopolnitelnyi.png')
            ->update(['image' => 'products/rukav-vsasyvajushhii-dopolnitelnyi-2.png']);
    }

    public function down(): void
    {
        DB::table('products')
            ->whereIn('slug', [
                'dymosos-dpje-7-25cm-dpje-a-k-25-2000',
                'dymosos-dpje-7-25c-dpje-a-p-25-2000',
            ])
            ->update(['is_active' => true]);

        DB::table('product_starter_kit_items')
            ->where('image', 'products/rukav-vsasyvajushhii-dopolnitelnyi-2.png')
            ->update(['image' => 'products/rukav-vsasyvajushhii-dopolnitelnyi.png']);
    }
};
