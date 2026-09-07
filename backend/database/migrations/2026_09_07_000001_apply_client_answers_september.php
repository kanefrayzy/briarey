<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Ответы Бриарея (сентябрь 2026) + ТЗ по страницам «Дилерам» и «Вакансии».
     *
     *  — блоков Revit нет, выезда на объект с замерами нет, отгрузка 1–3 дня только
     *    по базовым позициям, компании 15 лет (а не 20);
     *  — первый экран и этапы страницы «Дилерам» переписаны под новую позицию;
     *  — активных вакансий сейчас нет — карточки скрываем;
     *  — заводим новую позицию каталога СУ-ВВ 300х300.
     *
     * Миграция идемпотентна: повторный запуск ничего не ломает.
     */
    public function up(): void
    {
        $this->updateAdvantages();
        $this->updateYearsOnMarket();
        $this->updateDealersPage();
        $this->hideVacancies();
        $this->addUzelVv300();
    }

    /** Преимущества на главной — приводим к тому, что компания реально делает. */
    private function updateAdvantages(): void
    {
        $advantages = [
            1 => [
                'title'       => 'Отгрузка базовых позиций 1–3 дня',
                'description' => 'Основные позиции поддерживаем в наличии. Для базового оборудования — '
                    . 'оперативная комплектация и отгрузка в течение 1–3 рабочих дней после оплаты счёта.',
            ],
            3 => [
                'title'       => 'Документация для проектировщиков',
                'description' => 'Предоставляем технические материалы, BIM-модели и блоки AutoCAD '
                    . 'для включения оборудования в проект.',
            ],
            4 => [
                'title'       => 'Консультация по подбору оборудования',
                'description' => 'Помогаем дистанционно подобрать оборудование под параметры объекта. '
                    . 'Для предварительного расчёта доступен онлайн-калькулятор, для нестандартных задач — '
                    . 'консультация специалиста.',
            ],
        ];

        foreach ($advantages as $id => $data) {
            DB::table('advantages')->where('id', $id)->update($data + ['updated_at' => now()]);
        }
    }

    /** Компании 15 лет, а не 20 — правим и главную, и текст «О компании». */
    private function updateYearsOnMarket(): void
    {
        DB::table('production_features')
            ->where('title', 'like', '20 лет%')
            ->update(['title' => '15 лет на рынке', 'updated_at' => now()]);

        $about = DB::table('about_pages')->first();
        if ($about && str_contains((string) $about->column_2_text, 'За более чем 20 лет')) {
            DB::table('about_pages')->where('id', $about->id)->update([
                'column_2_text' => str_replace(
                    'За более чем 20 лет работы',
                    'За 15 лет работы',
                    $about->column_2_text
                ),
                'updated_at' => now(),
            ]);
        }
    }

    /** Страница «Дилерам»: производитель открыт к предложениям, а не раздаёт скидки. */
    private function updateDealersPage(): void
    {
        DB::table('dealers_pages')->where('id', 1)->update([
            'hero_title'       => "Продукция БРИАРЕЙ\nв вашем ассортименте",
            'hero_description' => 'Расширьте предложение оборудованием для газо- и дымоудаления российского '
                . 'производства. 95% ассортимента мы производим самостоятельно и обеспечиваем партнёров '
                . 'технической документацией и консультационной поддержкой.',
            'hero_button_text' => 'Предложить сотрудничество',
            'updated_at'       => now(),
        ]);

        $steps = [
            1 => [
                'title'       => 'Знакомимся',
                'description' => 'Расскажите о компании, регионе работы, клиентах и направлениях продаж.',
            ],
            2 => [
                'title'       => 'Получаем ваше предложение',
                'description' => 'Предложите формат сотрудничества, планируемые объёмы и коммерческую модель, '
                    . 'которая интересна вашей компании.',
            ],
            3 => [
                'title'       => 'Согласовываем партнёрство',
                'description' => 'Обсуждаем условия, возможности производителя и формат технической поддержки.',
            ],
        ];

        foreach ($steps as $id => $data) {
            DB::table('dealer_steps')->where('id', $id)->update($data + ['updated_at' => now()]);
        }
    }

    /** Активных вакансий сейчас нет — тестовые карточки убираем из выдачи. */
    private function hideVacancies(): void
    {
        DB::table('vacancies')->where('is_active', true)->update([
            'is_active'  => false,
            'updated_at' => now(),
        ]);
    }

    /** Новая позиция каталога: узел стыковочный СУ-ВВ 300х300 (данные от Бриарея). */
    private function addUzelVv300(): void
    {
        $slug = 'uzel-stykovochnyj-vv-300h300';

        if (DB::table('products')->where('slug', $slug)->exists()) {
            return;
        }

        $base = DB::table('products')->where('slug', 'uzel-stykovochnyj-vv')->first();
        if (!$base) {
            return;
        }

        $productId = DB::table('products')->insertGetId([
            'category_id' => $base->category_id,
            'slug'        => $slug,
            'name'        => 'Узел стыковочный СУ-ВВ Бриарей 300х300мм',
            'price'       => 10900,
            'image'       => $base->image,
            'sort_order'  => $base->sort_order ?? 0,
            'is_active'   => true,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        DB::table('product_images')->insert([
            'product_id' => $productId,
            'image'      => $base->image,
            'sort_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $values = [
            'dimensions'      => '360*360 мм',
            'cut_dimensions'  => '300*300 мм',
            'fire_resistance' => 'EI 60 (цена указана выше) или EI 90 (цену узнавайте у менеджера)',
            'weight'          => '3 кг',
        ];

        $attrs = DB::table('category_attributes')
            ->where('category_id', $base->category_id)
            ->pluck('id', 'key');

        foreach ($values as $key => $value) {
            if (!isset($attrs[$key])) {
                continue;
            }
            DB::table('product_attribute_values')->insert([
                'product_id'            => $productId,
                'category_attribute_id' => $attrs[$key],
                'value'                 => $value,
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        }

        $specId = DB::table('product_main_specs')->insertGetId([
            'product_id' => $productId,
            'title'      => 'Назначение',
            'sort_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_main_spec_columns')->insert([
            'product_main_spec_id' => $specId,
            'heading'              => 'Описание:',
            'content'              => json_encode([
                'Габаритные размеры: 360*360 мм',
                'Врезные размеры: 300*300 мм',
                'Предел огнестойкости: EI 60 (цена указана выше) или EI 90 (цену узнавайте у менеджера)',
                'Масса: 3 кг',
                'Узел стыковочный СУ-ВВ Бриарей предназначен для соединения напорной рукавной линий дымососа '
                    . 'с системой вытяжной вентиляции. Узел стыковочный СУ-ВВ Бриарей монтируется в воздуховод '
                    . 'вытяжной вентиляции. Для соединения узла стыковочного с напорной линией дымососа '
                    . 'используется адаптер вытяжной для узла стыковочного СУ-ВВ Бриарей. Адаптер поставляется '
                    . 'в комплекте с дымососом или заказывается отдельно (один адаптер на один дымосос).',
                'Данный узел стыковочный предназначен для дымососов производительностью от 4000 м3/час '
                    . 'до 5000 м3/час включительно.',
            ], JSON_UNESCAPED_UNICODE),
            'sort_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // Контентная правка — обратной операции нет.
    }
};
