<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('phone_1', 30)->nullable();
            $table->string('phone_2', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('work_hours', 100)->nullable();
            $table->text('address')->nullable();
            $table->string('inn', 20)->nullable();
            $table->string('ogrn', 20)->nullable();
            $table->string('okpo', 20)->nullable();
            $table->string('company_name')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
