<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnersSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 6; $i++) {
            Partner::create([
                'sort_order' => $i,
                'name' => "Партнёр {$i}",
                'logo' => null,
                'is_active' => true,
            ]);
        }
    }
}
