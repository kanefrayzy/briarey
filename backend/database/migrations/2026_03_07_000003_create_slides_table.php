<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('image')->nullable();
            $table->string('title');
            $table->text('subtitle')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('stat_title')->nullable();
            $table->text('stat_description')->nullable();
            $table->text('next_feature')->nullable();
            $table->string('button_text', 100)->nullable();
            $table->string('button_link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slides');
    }
};
