<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class CalculatorController extends Controller
{
    /**
     * Подобрать дымосос по площади помещения и скорости удаления,
     * а также собрать комплектацию (узлы, рукава, обвязка) реальными товарами.
     *
     * GET /api/calculator/recommend?area=250&speed=standard&zones=1&node_type=exhaust&suction=5&discharge=40&rooms=1
     *
     * speed: "standard" (4-кратный обмен)  → требуемая = площадь × 6
     *        "fast"     (10-мин продув)    → требуемая = площадь × 9
     * Зоны/узлы/рукава влияют только на комплектацию, не на производительность.
     */
    public function recommend(Request $request)
    {
        $area      = (int) $request->input('area', 0);
        $speed     = $request->input('speed', 'standard');           // standard | fast
        $zones     = (int) $request->input('zones', 1) === 2 ? 2 : 1;
        $nodeType  = $request->input('node_type', 'exhaust');        // exhaust | supply_exhaust
        $suction   = (float) $request->input('suction', 5);
        $discharge = (int) $request->input('discharge', 10);
        $rooms     = max(1, (int) $request->input('rooms', 1));

        if ($area <= 0 || $area > 100000) {
            return response()->json(['error' => 'Некорректная площадь помещения.'], 422);
        }

        // Требуемая производительность (м³/ч): площадь × коэффициент режима.
        $coef = $speed === 'fast' ? 9 : 6;
        $required = $area * $coef;

        // Дымососы
        $category = Category::where('slug', 'dymososy')->first();
        if (!$category) {
            return response()->json(['error' => 'Категория дымососов не найдена.'], 404);
        }

        $products = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->with(['attributeValues.categoryAttribute', 'images'])
            ->get();

        // Парсим производительность из текста атрибута ("1500 м³/ч", "от 2000 м³/ч")
        $parsed = $products->map(function ($product) {
            $productivity = null;
            foreach ($product->attributeValues as $av) {
                if ($av->categoryAttribute && $av->categoryAttribute->key === 'productivity') {
                    if (preg_match('/\d[\d\s]*/u', $av->value, $m)) {
                        $productivity = (int) preg_replace('/\D/', '', $m[0]);
                    }
                    break;
                }
            }

            return ['product' => $product, 'productivity' => $productivity];
        })->filter(fn ($r) => $r['productivity'] !== null);

        // Наименьший подходящий: производительность >= required
        $suitable = $parsed
            ->filter(fn ($r) => $r['productivity'] >= $required)
            ->sortBy('productivity')
            ->values();

        // Если ничего не подходит — самый мощный
        if ($suitable->isEmpty()) {
            $suitable = $parsed->sortByDesc('productivity')->take(1)->values();
        }

        // Показываем рекомендованный + пару ближайших более мощных
        $suitable = $suitable->take(3);

        $results = $suitable->map(function ($r) {
            $p = $r['product'];
            $image = $p->images->first()?->image ?? $p->image;

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

        // Комплектация реальными товарами
        $accessories = $this->buildAccessories($zones, $nodeType, $suction, $discharge, $rooms);

        return response()->json([
            'required_productivity' => $required,
            'area'                  => $area,
            'speed'                 => $speed,
            'zones'                 => $zones,
            'products'              => $results,
            'accessories'           => $accessories,
        ]);
    }

    /**
     * Собирает список доп. товаров (узлы стыковочные, доп. напорные рукава,
     * двухзонная обвязка) по параметрам подбора. Берёт реальные товары из каталога;
     * если товара нет в базе — просто пропускает его.
     */
    private function buildAccessories(int $zones, string $nodeType, float $suction, int $discharge, int $rooms): array
    {
        $items = [];

        // Узлы стыковочные: вытяжной → СУ-В, приточно-вытяжной → СУ-ВП. Кол-во = помещения × зоны.
        $nodeSlug = $nodeType === 'supply_exhaust'
            ? 'uzel-stykovochnyi-vp-us-vp-300h300-mm'
            : 'uzel-stykovochnyj-v';
        $nodeQty = $rooms * $zones;
        $items[] = ['slug' => $nodeSlug, 'qty' => $nodeQty];

        // Доп. напорные рукава: в стартовый комплект входит 10 м, остальное — докупаем.
        $extraDischarge = max(0, (int) ceil($discharge / 10) - 1) * $rooms;
        if ($extraDischarge > 0) {
            $items[] = ['slug' => 'rukav-napornyi-dopolnitelnyi-rn', 'qty' => $extraDischarge];
        }

        // Двухзонная обвязка — при двухзонном удалении, по одной на помещение.
        if ($zones === 2) {
            $items[] = ['slug' => 'vsasyvajushhaja-dvuhzonnaja-obvjazka', 'qty' => $rooms];
        }

        // Подгружаем реальные товары и формируем ответ.
        $slugs = array_column($items, 'slug');
        $products = Product::whereIn('slug', $slugs)->where('is_active', true)
            ->with('images')->get()->keyBy('slug');

        $accessories = [];
        foreach ($items as $item) {
            $p = $products->get($item['slug']);
            if (!$p || $item['qty'] <= 0) {
                continue;
            }
            $accessories[] = [
                'id'    => $p->id,
                'slug'  => $p->slug,
                'name'  => $p->name,
                'price' => $p->price,
                'image' => $p->images->first()?->image ?? $p->image,
                'qty'   => $item['qty'],
            ];
        }

        return $accessories;
    }
}
