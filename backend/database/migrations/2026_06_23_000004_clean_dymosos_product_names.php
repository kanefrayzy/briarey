<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Убирает «второе имя» (ДПЭ-А-К/П-…) из названий дымососов там, где оно
     * идёт после основного имени в скобках, например:
     *   «Дымосос ДПЭ-7 (2ЦМ) ДПЭ-А-К-2,0 (2000)» → «Дымосос ДПЭ-7 (2ЦМ) (2000)».
     * Самостоятельные названия вида «Дымосос ДПЭ-А-К-2,5 (3500)» не затрагиваются
     * (перед «ДПЭ-А» нет закрывающей скобки). Идемпотентно.
     */
    public function up(): void
    {
        $products = DB::table('products')
            ->where('name', 'like', '%) ДПЭ-А-%')
            ->get(['id', 'name']);

        foreach ($products as $p) {
            $new = preg_replace('/\) ДПЭ-А-[КП]-[\d,]+/u', ')', $p->name);
            if ($new !== null && $new !== $p->name) {
                DB::table('products')->where('id', $p->id)->update(['name' => $new]);
            }
        }
    }

    public function down(): void
    {
        // Восстановить исходные названия автоматически нельзя — обратной операции нет.
    }
};
