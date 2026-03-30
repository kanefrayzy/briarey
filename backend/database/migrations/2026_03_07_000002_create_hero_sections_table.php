<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('cta_text', 100)->nullable();
            $table->string('cta_link')->nullable();
            $table->string('card_title')->nullable();
            $table->text('card_description')->nullable();
            $table->string('card_button_text', 100)->nullable();
            $table->string('card_button_link')->nullable();
            $table->string('background_image')->nullable();
            $table->string('product_image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_sections');
    }
};
