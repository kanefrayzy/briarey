<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('categories')
            ->where('slug', 'dymososy-dlya-pozharnyh-mashin')
            ->update(['name' => 'Оборудование для пожарных расчётов']);
    }

    public function down(): void
    {
        DB::table('categories')
            ->where('slug', 'dymososy-dlya-pozharnyh-mashin')
            ->update(['name' => 'Дымососы для пожарных машин']);
    }
};
