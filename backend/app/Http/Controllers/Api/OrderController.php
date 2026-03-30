<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'delivery_method' => 'required|in:delivery,pickup',
            'recipient_type'  => 'required|in:legal,individual',
            'name'            => 'required|string|max:255',
            'phone'           => 'required|string|max:50',
            'email'           => 'nullable|email|max:255',
            'requisites'      => 'nullable|string|max:5000',
            'address'         => 'nullable|string|max:500',
            'entrance'        => 'nullable|string|max:50',
            'floor'           => 'nullable|string|max:50',
            'apartment'       => 'nullable|string|max:100',
            'comment'         => 'nullable|string|max:2000',
            'items'           => 'required|array|min:1|max:50',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.qty'        => 'required|integer|min:1|max:999',
            'items.*.extras'     => 'nullable|array',
            'items.*.extras.*.id'   => 'required_with:items.*.extras|integer|exists:product_extras,id',
            'items.*.extras.*.qty'  => 'required_with:items.*.extras|integer|min:1|max:99',
            'items.*.configuration' => 'nullable|array',
            'items.*.configuration.suction_length'  => 'nullable|integer|min:0|max:100',
            'items.*.configuration.exhaust_length'   => 'nullable|integer|min:0|max:100',
        ]);

        $total = 0;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $extrasSum = 0;
            $extrasInfo = [];

            if (!empty($item['extras'])) {
                foreach ($item['extras'] as $extra) {
                    $productExtra = $product->extras()->findOrFail($extra['id']);
                    $extrasSum += $productExtra->price * $extra['qty'];
                    $extrasInfo[] = [
                        'name'  => $productExtra->name,
                        'price' => $productExtra->price,
                        'qty'   => $extra['qty'],
                    ];
                }
            }

            $linePrice = $product->price + $extrasSum;
            $total += $linePrice * $item['qty'];

            $itemsData[] = [
                'product_id'    => $product->id,
                'product_name'  => $product->name,
                'price'         => $linePrice,
                'qty'           => $item['qty'],
                'extras'        => $extrasInfo ?: null,
                'configuration' => $item['configuration'] ?? null,
            ];
        }

        $order = Order::create([
            'number'          => 'BR-' . strtoupper(Str::random(8)),
            'status'          => 'new',
            'delivery_method' => $validated['delivery_method'],
            'recipient_type'  => $validated['recipient_type'],
            'name'            => $validated['name'],
            'phone'           => $validated['phone'],
            'email'           => $validated['email'] ?? null,
            'requisites'      => $validated['requisites'] ?? null,
            'address'         => $validated['address'] ?? null,
            'entrance'        => $validated['entrance'] ?? null,
            'floor'           => $validated['floor'] ?? null,
            'apartment'       => $validated['apartment'] ?? null,
            'comment'         => $validated['comment'] ?? null,
            'total'           => $total,
        ]);

        foreach ($itemsData as $itemData) {
            $order->items()->create($itemData);
        }

        return response()->json([
            'success'      => true,
            'order_number' => $order->number,
        ], 201);
    }
}
