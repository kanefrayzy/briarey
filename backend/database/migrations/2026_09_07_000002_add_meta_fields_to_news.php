<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Отдельные SEO-поля для новости: заголовок и описание в поисковой выдаче
     * часто должны отличаться от заголовка на странице. Если поля пустые —
     * фронтенд подставляет обычные title и excerpt.
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('excerpt');
            $table->text('meta_description')->nullable()->after('meta_title');
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['meta_title', 'meta_description']);
        });
    }
};
