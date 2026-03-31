<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class CalculatorController extends Controller
{
    /**
     * Подобрать дымососы по объёму помещения и скорости удаления.
     *
     * GET /api/calculator/recommend?volume=185&speed=fast&zones=1
     *
     * speed: "standard" (4-кратный обмен за 1 час) | "fast" (10-минутный продув)
     * zones: 1 | 2
     */
    public function recommend(Request $request)
    {
        $volume = (int) $request->input('volume', 0);
        $speed  = $request->input('speed', 'fast'); // standard | fast
        $zones  = (int) $request->input('zones', 1);

        if ($volume <= 0 || $volume > 10000) {
            return response()->json(['error' => 'Некорректный объём помещения.'], 422);
        }

        // Рассчитываем требуемую производительность (м³/ч)
        // fast: удалить за 10 минут → V * 6
        // standard: 4-кратный обмен за 1 час → V * 4
        $multiplier = $speed === 'fast' ? 6 : 4;
        $required = $volume * $multiplier * $zones;

        // Загружаем все дымососы из категории dymososy
        $category = Category::where('slug', 'dymososy')->first();
        if (!$category) {
            return response()->json(['error' => 'Категория дымососов не найдена.'], 404);
        }

        $products = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->with(['attributeValues.categoryAttribute', 'images'])
            ->get();

        // Парсим производительность из текста атрибута
        // Форматы: "1500 м³/ч", "до 2000 м³/ч", "до 15000 м³/ч"
        $parsed = $products->map(function ($product) {
            $productivity = null;
            foreach ($product->attributeValues as $av) {
                if ($av->categoryAttribute && $av->categoryAttribute->key === 'productivity') {
                    // Извлекаем первое число из строки
                    if (preg_match('/[\d\s]+/', str_replace(' ', '', $av->value), $m)) {
                        $productivity = (int) preg_replace('/\D/', '', $m[0]);
                    }
                    break;
                }
            }

            return [
                'product'      => $product,
                'productivity' => $productivity,
            ];
        })->filter(fn ($r) => $r['productivity'] !== null);

        // Отбираем подходящие: производительность >= required
        $suitable = $parsed
            ->filter(fn ($r) => $r['productivity'] >= $required)
            ->sortBy('productivity')
            ->values();

        // Если нет подходящих — показываем самый мощный (ближайший снизу)
        if ($suitable->isEmpty()) {
            $suitable = $parsed
                ->sortByDesc('productivity')
                ->take(1)
                ->values();
        }

        // Формируем ответ
        $results = $suitable->map(function ($r) {
            $p = $r['product'];
            $image = $p->images->first()?->image ?? $p->image;

            // Собираем все атрибуты в читаемый вид
            $specs = $p->attributeValues->map(fn ($av) => [
                'key'   => $av->categoryAttribute?->key,
                'label' => $av->categoryAttribute?->name,
                'value' => $av->value,
                'unit'  => $av->categoryAttribute?->unit,
            ])->filter(fn ($s) => $s['label'])->values();

            return [
                'id'           => $p->id,
                'slug'         => $p->slug,
                'name'         => $p->name,
                'price'        => $p->price,
                'image'        => $image,
                'productivity' => $r['productivity'],
                'specs'        => $specs,
            ];
        })->values();

        return response()->json([
            'required_productivity' => $required,
            'volume'                => $volume,
            'speed'                 => $speed,
            'zones'                 => $zones,
            'products'              => $results,
        ]);
    }
}
