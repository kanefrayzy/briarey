<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Update all "Рукав всасывающий" starter kit items to use the new PNG
$suctionUpdated = DB::table('product_starter_kit_items')
    ->where('name', 'like', '%всасыв%')
    ->update(['image' => 'products/rukav-vsasyvajushhii-dopolnitelnyi.png']);

// Update all "Рукав напорный" starter kit items to use the new PNG
$exhaustUpdated = DB::table('product_starter_kit_items')
    ->where('name', 'like', '%напорн%')
    ->update(['image' => 'products/rukav-napornyi-dopolnitelnyi-rn.png']);

echo "Рукав всасывающий updated: {$suctionUpdated}\n";
echo "Рукав напорный updated: {$exhaustUpdated}\n";

// Verify
$sample = App\Models\Product::where('slug', 'dymosos-dpje-7-1c')
    ->with('starterKitItems')
    ->first();
echo "\nVerification ({$sample->name}):\n";
foreach ($sample->starterKitItems as $k) {
    echo "  {$k->name} | {$k->image}\n";
}
