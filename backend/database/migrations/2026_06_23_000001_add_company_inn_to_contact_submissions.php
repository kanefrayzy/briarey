<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->string('company')->nullable()->after('email');
            $table->string('inn', 20)->nullable()->after('company');
        });
    }

    public function down(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->dropColumn(['company', 'inn']);
        });
    }
};
