<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('section_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('button_text', 100)->nullable();
            $table->string('button_link')->nullable();
            $table->timestamps();
        });

        Schema::create('advantages', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('icon', 50)->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('work_steps', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('production_features', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->text('question');
            $table->text('answer');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('production_features');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('work_steps');
        Schema::dropIfExists('advantages');
        Schema::dropIfExists('section_settings');
    }
};
