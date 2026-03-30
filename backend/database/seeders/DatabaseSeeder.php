<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@briarey.ru',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            SiteSettingsSeeder::class,
            HeroSectionSeeder::class,
            SectionSettingsSeeder::class,
            AdvantagesSeeder::class,
            WorkStepsSeeder::class,
            PartnersSeeder::class,
            ProductionSeeder::class,
            FaqSeeder::class,
            SmartPickSeeder::class,
            CalculatorCtaSeeder::class,
            NewsSeeder::class,
            CertificatesSeeder::class,
            VacanciesSeeder::class,
            AboutPageSeeder::class,
            DealersPageSeeder::class,
            CatalogSeeder::class,
        ]);
    }
}
