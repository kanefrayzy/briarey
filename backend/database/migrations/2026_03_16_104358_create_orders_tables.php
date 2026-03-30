<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number', 32)->unique();
            $table->enum('status', ['new', 'processing', 'completed', 'cancelled'])->default('new');
            $table->enum('delivery_method', ['delivery', 'pickup'])->default('delivery');
            $table->enum('recipient_type', ['legal', 'individual'])->default('individual');
            $table->string('name');
            $table->string('phone', 50);
            $table->string('email')->nullable();
            $table->text('requisites')->nullable();
            $table->string('address')->nullable();
            $table->string('entrance')->nullable();
            $table->string('floor')->nullable();
            $table->string('apartment')->nullable();
            $table->text('comment')->nullable();
            $table->integer('total')->default(0);
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->integer('price');
            $table->integer('qty')->default(1);
            $table->json('extras')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
