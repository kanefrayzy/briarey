<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use App\Models\VacanciesPage;
use Illuminate\Database\Seeder;

class VacanciesSeeder extends Seeder
{
    public function run(): void
    {
        VacanciesPage::create([
            'hero_title' => 'Вакансии',
            'hero_description' => 'Присоединяйтесь к команде профессионалов',
        ]);

        $vacancies = [
            ['sort_order' => 1, 'title' => 'Инженер', 'salary' => 'от 70 000 руб.', 'duties' => 'Проектирование систем вентиляции и дымоудаления, разработка технической документации, сопровождение проектов', 'is_active' => true],
            ['sort_order' => 2, 'title' => 'Инженер', 'salary' => 'от 70 000 руб.', 'duties' => 'Проектирование систем вентиляции и дымоудаления, разработка технической документации, сопровождение проектов', 'is_active' => true],
            ['sort_order' => 3, 'title' => 'Инженер', 'salary' => 'от 70 000 руб.', 'duties' => 'Проектирование систем вентиляции и дымоудаления, разработка технической документации, сопровождение проектов', 'is_active' => true],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancy::create($vacancy);
        }
    }
}
