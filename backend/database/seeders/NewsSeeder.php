<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\NewsContentBlock;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $newsItems = [
            ['slug' => 'pozharnaya-bezopasnost-2024', 'title' => 'XVIII Международный салон «Комплексная безопасность-2024»', 'excerpt' => 'Приглашаем посетить наш стенд на выставке...', 'date' => '2024-06-15'],
            ['slug' => 'novye-dymososy-dpe', 'title' => 'Новые дымососы серии ДПЭ', 'excerpt' => 'Расширили линейку дымососов подпора воздуха...', 'date' => '2024-05-20'],
            ['slug' => 'sertifikaciya-iso-9001', 'title' => 'Обновление сертификации ISO 9001', 'excerpt' => 'Успешно прошли ресертификацию системы менеджмента качества...', 'date' => '2024-04-10'],
            ['slug' => 'partnerskaya-programma', 'title' => 'Запуск партнёрской программы', 'excerpt' => 'Открываем программу для дилеров и проектных организаций...', 'date' => '2024-03-01'],
            ['slug' => 'obuchenie-proektirovshchikov', 'title' => 'Семинар для проектировщиков', 'excerpt' => 'Проводим обучающий семинар по проектированию систем дымоудаления...', 'date' => '2024-02-15'],
            ['slug' => 'rasshirenie-proizvodstva', 'title' => 'Расширение производственных мощностей', 'excerpt' => 'Запустили новый производственный цех...', 'date' => '2024-01-20'],
        ];

        $defaultText = 'Компания «БРИАРЕЙ» приняла участие в XVIII Международном салоне «Комплексная безопасность-2024». На стенде были представлены новейшие разработки в области систем газодымоудаления.';

        foreach ($newsItems as $item) {
            $news = News::create(array_merge($item, [
                'is_published' => true,
                'is_featured' => false,
            ]));

            NewsContentBlock::create([
                'news_id' => $news->id,
                'sort_order' => 1,
                'title' => $news->title,
                'text' => $defaultText,
            ]);
        }
    }
}
