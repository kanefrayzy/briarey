<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class CalculatorController extends Controller
{
    /**
     * Подбор дымососа и комплектации по ТЗ Бриарея (июль 2026).
     *
     * GET /api/calculator/recommend
     *   volume     — максимальный объём защищаемого помещения, м³
     *   rooms      — количество защищаемых помещений (1..999)
     *   zones      — 1 (однозонное) | 2 (двухзонное удаление)
     *   node_type  — exhaust (вытяжной) | supply_exhaust (приточно-вытяжной)
     *   montage    — internal (внутренняя перегородка) | external (уличная стена)
     *   suction    — однозонное: 1.5 | 5; двухзонное: 3 (стандарт) | custom (верхний более 3 м)
     *   distance   — расстояние до точки выброса, м (свободный ввод)
     *   discharge  — street (улица) | vent (вытяжная вентиляция) | shaft (шахта дымоудаления)
     *
     * Логика:
     *  - дымосос по таблице объёмов (до 100/200/300/400/500 м³), свыше 500 — консультация;
     *  - требуемая производительность (справочно) = объём × 4 (строгий 4-кратный обмен);
     *  - при паре Ц/ЦМ берём более дешёвый в розницу;
     *  - узлы = помещения × зоны, адаптеры = зоны (на один дымосос),
     *    двухзонная обвязка — 1 шт; в зачёт расстояния идёт всасывающая часть
     *    (рукав 1,5/5 м или нижний рукав обвязки 2,5 м) + напорный 10 м из комплекта.
     */

    /** Таблица подбора: верхняя граница объёма → slug-кандидаты (Ц/ЦМ). */
    private const VOLUME_TABLE = [
        [100, ['dymosos-dpje-7-1c', 'dymosos-dpje-7-1cm']],
        [200, ['dymosos-dpje-7-2c', 'dymosos-dpje-7-2cm-dpje-a-k-20-2000']],
        [300, ['dymosos-dpje-7-4c', 'dymosos-dpje-7-4cm']],
        [400, ['dymosos-dpje-a-p-315-4000']],
        [500, ['dymosos-dpje-a-p-315-5000']],
    ];

    private const NODE_SLUGS = [
        'internal' => [
            'exhaust'        => 'uzel-stykovochnyj-v',
            'supply_exhaust' => 'uzel-stykovochnyi-vp-us-vp-300h300-mm',
        ],
        'external' => [
            'exhaust'        => 'uzel-stykovochnyj-v-ui-300h300',
            'supply_exhaust' => 'uzel-stykovochnyj-vp-ui-300h300',
        ],
    ];

    private const ADAPTER_SLUGS = [
        'exhaust'        => 'adapter-vytjazhnoi-dlja-uzla-stykovochn',
        'supply_exhaust' => 'adapter-pritochno-vytjazhnoi-dlja-uzla-s',
    ];

    private const SLUG_OBVYAZKA        = 'vsasyvajushhaja-dvuhzonnaja-obvjazka';
    private const SLUG_NAPORNY_EXTRA   = 'rukav-napornyi-dopolnitelnyi-rn';
    private const SLUG_UZEL_VV         = 'uzel-stykovochnyj-vv';
    private const SLUG_ADAPTER_VV      = 'adapter-vytjazhnoi-dlja-uzla-stykovochn-2';
    private const SLUG_UZEL_DU         = 'uzel-stykovochnyj-du';

    public function recommend(Request $request)
    {
        $volume    = (float) $request->input('volume', 0);
        $rooms     = min(999, max(1, (int) $request->input('rooms', 1)));
        $zones     = (int) $request->input('zones', 1) === 2 ? 2 : 1;
        $nodeType  = $request->input('node_type') === 'supply_exhaust' ? 'supply_exhaust' : 'exhaust';
        $montage   = $request->input('montage') === 'external' ? 'external' : 'internal';
        $suction   = (string) $request->input('suction', $zones === 2 ? '3' : '5');
        $distance  = max(0, (float) $request->input('distance', 10));
        $discharge = in_array($request->input('discharge'), ['vent', 'shaft'], true)
            ? $request->input('discharge')
            : 'street';

        if ($volume <= 0 || $volume > 100000) {
            return response()->json(['error' => 'Некорректный объём помещения.'], 422);
        }

        $required = (int) ceil($volume * 4);

        // Свыше 500 м³ — только консультация с производителем
        if ($volume > 500) {
            return response()->json([
                'required_productivity' => $required,
                'volume'                => $volume,
                'consultation_required' => true,
                'non_standard'          => false,
                'product'               => null,
                'accessories'           => [],
                'accessories_total'     => 0,
                'total'                 => 0,
            ]);
        }

        // Дымосос по таблице; при паре Ц/ЦМ — более дешёвый в рознице
        $slugs = null;
        foreach (self::VOLUME_TABLE as [$limit, $group]) {
            if ($volume <= $limit) {
                $slugs = $group;
                break;
            }
        }

        $product = Product::whereIn('slug', $slugs)
            ->where('is_active', true)
            ->with(['attributeValues.categoryAttribute', 'images'])
            ->orderBy('price')
            ->first();

        if (!$product) {
            return response()->json(['error' => 'Подходящий дымосос не найден в каталоге.'], 404);
        }

        $nonStandard = $zones === 2 && $suction === 'custom';

        $accessories = $this->buildAccessories($rooms, $zones, $nodeType, $montage, $suction, $distance, $discharge);
        $accessoriesTotal = array_sum(array_map(fn ($a) => $a['price'] * $a['qty'], $accessories));

        return response()->json([
            'required_productivity' => $required,
            'volume'                => $volume,
            'consultation_required' => false,
            'non_standard'          => $nonStandard,
            'product'               => $this->presentProduct($product),
            'accessories'           => $accessories,
            'accessories_total'     => $accessoriesTotal,
            'total'                 => $product->price + $accessoriesTotal,
        ]);
    }

    private function presentProduct(Product $p): array
    {
        $specs = $p->attributeValues->map(fn ($av) => [
            'key'   => $av->categoryAttribute?->key,
            'label' => $av->categoryAttribute?->name,
            'value' => $av->value,
            'unit'  => $av->categoryAttribute?->unit,
        ])->filter(fn ($s) => $s['label'])->values();

        return [
            'id'    => $p->id,
            'slug'  => $p->slug,
            'name'  => $p->name,
            'price' => $p->price,
            'image' => $p->images->first()?->image ?? $p->image,
            'specs' => $specs,
        ];
    }

    private function buildAccessories(
        int $rooms,
        int $zones,
        string $nodeType,
        string $montage,
        string $suction,
        float $distance,
        string $discharge,
    ): array {
        $items = [];

        // Узлы стыковочные: помещения × зоны; тип по (монтаж, тип узла)
        $items[] = ['slug' => self::NODE_SLUGS[$montage][$nodeType], 'qty' => $rooms * $zones];

        // Адаптеры: 1 при однозонном, 2 при двухзонном — на один дымосос
        $items[] = ['slug' => self::ADAPTER_SLUGS[$nodeType], 'qty' => $zones];

        // Двухзонная обвязка — 1 шт (заменяет всасывающий рукав из комплекта)
        if ($zones === 2) {
            $items[] = ['slug' => self::SLUG_OBVYAZKA, 'qty' => 1];
        }

        // Напорные рукава: в зачёт идёт всасывающая часть + 10 м из комплекта,
        // остальное закрываем доп. рукавами по 10 м (округление вверх)
        $coverage = $zones === 2 ? 2.5 : (float) $suction; // нижний рукав обвязки или всасывающий 1,5/5
        $extraNaporny = (int) max(0, ceil(($distance - $coverage - 10) / 10));
        if ($extraNaporny > 0) {
            $items[] = ['slug' => self::SLUG_NAPORNY_EXTRA, 'qty' => $extraNaporny];
        }

        // Куда выброс: вентиляция → СУ-ВВ + адаптер; шахта → СУ-ДУ без адаптера
        if ($discharge === 'vent') {
            $items[] = ['slug' => self::SLUG_UZEL_VV, 'qty' => 1];
            $items[] = ['slug' => self::SLUG_ADAPTER_VV, 'qty' => 1];
        } elseif ($discharge === 'shaft') {
            $items[] = ['slug' => self::SLUG_UZEL_DU, 'qty' => 1];
        }

        // Подтягиваем реальные товары; отсутствующие в каталоге пропускаем
        $slugs = array_column($items, 'slug');
        $products = Product::whereIn('slug', $slugs)
            ->where('is_active', true)
            ->with('images')
            ->get()
            ->keyBy('slug');

        $result = [];
        foreach ($items as $item) {
            $p = $products->get($item['slug']);
            if (!$p || $item['qty'] <= 0) {
                continue;
            }
            $result[] = [
                'id'    => $p->id,
                'slug'  => $p->slug,
                'name'  => $p->name,
                'price' => $p->price,
                'image' => $p->images->first()?->image ?? $p->image,
                'qty'   => $item['qty'],
            ];
        }

        return $result;
    }
}
