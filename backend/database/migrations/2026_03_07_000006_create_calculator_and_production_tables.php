<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calculator_cta', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('title_highlight', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('button_text', 100)->nullable();
            $table->string('button_link')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('production_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('button_text', 100)->nullable();
            $table->string('button_link')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_sections');
        Schema::dropIfExists('calculator_cta');
    }
};
