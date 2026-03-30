<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$products = App\Models\Product::orderBy('id')->get();
$storageDir = storage_path('app/public/products');

$updated = 0;
$skipped = 0;

foreach ($products as $p) {
    $slugFile = "products/{$p->slug}.png";
    $fullPath = $storageDir . '/' . $p->slug . '.png';
    
    if (file_exists($fullPath)) {
        if ($p->image !== $slugFile) {
            $old = $p->image;
            $p->image = $slugFile;
            $p->save();
            $updated++;
            echo "UPDATED: {$p->slug} ({$old} → {$slugFile})\n";
        } else {
            $skipped++;
        }
    } else {
        $skipped++;
        // Keep existing image
    }
}

echo "\n=== Done ===\n";
echo "Updated: {$updated}, Skipped (already correct or no file): {$skipped}\n";
