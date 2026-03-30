<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            $table->string('video_url')->nullable();
            $table->string('poster_image')->nullable();
            $table->string('column_1_title')->nullable();
            $table->text('column_1_text')->nullable();
            $table->string('column_2_title')->nullable();
            $table->text('column_2_text')->nullable();
            $table->timestamps();
        });

        Schema::create('about_photos', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('image');
            $table->string('alt')->nullable();
            $table->timestamps();
        });

        Schema::create('dealers_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_button_text', 100)->nullable();
            $table->string('hero_image')->nullable();
            $table->timestamps();
        });

        Schema::create('dealer_steps', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('certificates_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('column_1_title')->nullable();
            $table->text('column_1_text')->nullable();
            $table->string('column_2_title')->nullable();
            $table->text('column_2_text')->nullable();
            $table->timestamps();
        });

        Schema::create('vacancies_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('column_1_title')->nullable();
            $table->text('column_1_text')->nullable();
            $table->string('column_2_title')->nullable();
            $table->text('column_2_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies_pages');
        Schema::dropIfExists('certificates_pages');
        Schema::dropIfExists('dealer_steps');
        Schema::dropIfExists('dealers_pages');
        Schema::dropIfExists('about_photos');
        Schema::dropIfExists('about_pages');
    }
};
