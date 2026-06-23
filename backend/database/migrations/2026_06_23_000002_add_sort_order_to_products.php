<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('products', 'sort_order')) {
            Schema::table('products', function (Blueprint $table) {
                $table->integer('sort_order')->default(0)->after('category_id');
            });
        }

        // Поднять дымососы ЭГЕОН на верхнюю строчку своей категории.
        DB::table('products')
            ->whereIn('slug', ['egeon-30m', 'egeon-40m', 'dyimosos-egeon-45e'])
            ->update(['sort_order' => -1]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'sort_order')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('sort_order');
            });
        }
    }
};
