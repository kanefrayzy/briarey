<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $text = 'За более чем 20 лет работы компания разработала и усовершенствовала линейки оборудования, '
            . 'включающие в себя: дымососы ДПЭ-7 и ДПМ-7; пожарные дымососы (нагнетатели) ЭГЕОН; '
            . 'узлы стыковочные вытяжные и приточно-вытяжные. С 2025-го года компания является участником '
            . 'проекта «СТР 01»: объединение ведущих компаний, специализирующихся на обеспечении пожарной безопасности.';

        DB::table('about_pages')
            ->where('column_2_text', 'like', 'За более чем 20 лет%')
            ->update(['column_2_text' => $text]);
    }

    public function down(): void
    {
        // Контентная правка — обратной операции нет.
    }
};
