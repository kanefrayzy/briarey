<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\CategoryAttribute;
use App\Models\Product;
use App\Models\ProductAttributeValue;
use App\Models\ProductCompositionItem;
use App\Models\ProductExtra;
use App\Models\ProductImage;
use App\Models\ProductMainSpec;
use App\Models\ProductMainSpecColumn;
use App\Models\ProductStarterKitItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

class ScrapeProducts extends Command
{
    protected $signature = 'scrape:products {--category= : Scrape only one category by old-site slug} {--dry-run : Preview without saving} {--fresh : Clean existing scraped data first}';
    protected $description = 'Scrape all products from briarey.ru into existing categories';

    private const BASE = 'https://briarey.ru';

    /**
     * Map: old-site category slug → existing DB category slug + attribute definitions.
     * DB slugs match CatalogSeeder slugs.
     */
    private array $categoryMap = [
        'exhauster' => [
            'db_slug' => 'dymososy',
            'attrs' => [
                ['Габаритный размер', 'dimensions', 'text', null],
                ['Масса',             'weight',     'text', 'кг'],
                ['Электродвигатель',  'engine',     'text', null],
                ['Производительность','productivity','text', 'м³/час'],
            ],
            'has_kit' => true,
        ],
        'dyimososyi-dlya-pozharnyix-avtomobilej' => [
            'db_slug' => 'dymososy-dlya-pozharnyh-mashin',
            'attrs' => [
                ['Габаритный размер', 'dimensions', 'text', null],
                ['Масса',             'weight',     'text', 'кг'],
                ['Двигатель',         'engine',     'text', null],
                ['Производительность','productivity','text', 'м³/час'],
            ],
            'has_kit' => true,
        ],
        'nodes-connecting' => [
            'db_slug' => 'uzel-stykovochnyj',
            'attrs' => [
                ['Габаритные размеры',   'dimensions',      'text', null],
                ['Врезные размеры',      'cut_dimensions',  'text', null],
                ['Предел огнестойкости', 'fire_resistance', 'text', null],
                ['Масса',               'weight',          'text', 'кг'],
            ],
            'has_kit' => false,
        ],
        'relief-valves' => [
            'db_slug' => 'klapana-sbrosa',
            'attrs' => [
                ['Габаритные размеры',         'dimensions',        'text', null],
                ['Площадь проходного сечения', 'section_area',      'text', 'см²'],
                ['Давление открытия заслонки', 'opening_pressure',  'text', 'кПа'],
                ['Размеры проема',             'opening_dimensions','text', null],
                ['Масса',                      'weight',            'text', 'кг'],
            ],
            'has_kit' => false,
        ],
        'storage-cabinets' => [
            'db_slug' => 'shkafy-dlya-hraneniya',
            'attrs' => [
                ['Габаритные размеры', 'dimensions', 'text', null],
                ['Масса',             'weight',     'text', 'кг'],
            ],
            'has_kit' => false,
        ],
        'installations' => [
            'db_slug' => 'ustanovki-sbora-veshchestva',
            'attrs' => [
                ['Габаритные размеры', 'dimensions',  'text', null],
                ['Масса',             'weight',      'text', 'кг'],
                ['Производительность','productivity','text', null],
            ],
            'has_kit' => false,
        ],
        'optional-equipment' => [
            'db_slug' => 'dop-oborudovanie',
            'attrs' => [
                ['Габаритные размеры', 'dimensions', 'text', null],
                ['Масса',             'weight',     'text', 'кг'],
            ],
            'has_kit' => false,
        ],
        'fireproof-doors' => [
            'db_slug' => 'dveri-protivopozharnye',
            'attrs' => [
                ['Предел огнестойкости', 'fire_resistance', 'text', null],
            ],
            'has_kit' => false,
        ],
    ];

    /**
     * Ordered attribute-parsing patterns.
     * First match per key wins — no duplicates.
     */
    private array $attrPatterns = [
        ['/Габаритн\w+\s+размер\w*\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu', 'dimensions'],
        ['/Масса\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',                     'weight'],
        ['/Электродвигатель\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',          'engine'],
        ['/Двигатель\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',                 'engine'],
        ['/Производительность\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',        'productivity'],
        ['/Врезн\w+\s+размер\w*\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',     'cut_dimensions'],
        ['/Предел\s+огнестойкости\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',    'fire_resistance'],
        ['/Площадь\s+проходного\s+сечения\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu', 'section_area'],
        ['/Давление\s+открытия\s*(?:заслонки)?\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu', 'opening_pressure'],
        ['/Размер\w*\s+проема\s*[:.]\s*(.+?)(?:\.\s*(?=[А-ЯЁA-Z])|\.\s*$|$)/mu',        'opening_dimensions'],
    ];

    private bool $dryRun = false;
    private int $downloadedImages = 0;
    private int $productCount = 0;

    /** Pending extras to link after all products are scraped. */
    private array $pendingExtras = [];

    public function handle(): int
    {
        $this->dryRun = (bool) $this->option('dry-run');
        $onlyCategory = $this->option('category');

        if ($this->dryRun) {
            $this->warn('DRY RUN — ничего не будет сохранено');
        }

        if ($this->option('fresh') && !$this->dryRun) {
            $this->cleanScrapedData();
        }

        $categories = $this->categoryMap;
        if ($onlyCategory) {
            if (!isset($categories[$onlyCategory])) {
                $this->error("Категория «{$onlyCategory}» не найдена на старом сайте");
                return 1;
            }
            $categories = [$onlyCategory => $categories[$onlyCategory]];
        }

        foreach ($categories as $oldSlug => $catDef) {
            $category = Category::where('slug', $catDef['db_slug'])->first();
            if (!$category) {
                $this->error("Категория «{$catDef['db_slug']}» не найдена в БД — пропускаем");
                continue;
            }

            $this->info("═══ {$category->name} (/{$oldSlug}/) → {$catDef['db_slug']} ═══");

            $attrMap = $this->ensureCategoryAttributes($category, $catDef['attrs']);

            $productUrls = $this->collectProductUrls($oldSlug);
            $this->info("  Найдено товаров: " . count($productUrls));

            foreach ($productUrls as $idx => $url) {
                $num = $idx + 1;
                $total = count($productUrls);
                $this->line("  [{$num}/{$total}] {$url}");

                try {
                    $this->scrapeProduct($url, $category, $attrMap, $catDef['has_kit']);
                } catch (\Throwable $e) {
                    $this->error("    ✗ {$e->getMessage()}");
                }

                usleep(300_000);
            }

            $this->newLine();
        }

        $this->info("Готово! Товаров: {$this->productCount}, изображений: {$this->downloadedImages}");

        // Post-processing: link related products as extras
        if (!$this->dryRun && !empty($this->pendingExtras)) {
            $this->linkRelatedProductExtras();
        }

        return 0;
    }

    // ─── Clean scraped data ────────────────────────────────────

    private function cleanScrapedData(): void
    {
        $this->warn('Очистка ранее импортированных данных...');

        $dbSlugs = array_column($this->categoryMap, 'db_slug');
        $categoryIds = Category::whereIn('slug', $dbSlugs)->pluck('id');
        $productIds = Product::whereIn('category_id', $categoryIds)->pluck('id');

        if ($productIds->isEmpty()) {
            $this->info('  Нечего чистить.');
            return;
        }

        ProductAttributeValue::whereIn('product_id', $productIds)->delete();
        ProductImage::whereIn('product_id', $productIds)->delete();
        ProductCompositionItem::whereIn('product_id', $productIds)->delete();
        ProductStarterKitItem::whereIn('product_id', $productIds)->delete();
        ProductExtra::whereIn('product_id', $productIds)->delete();

        $specIds = ProductMainSpec::whereIn('product_id', $productIds)->pluck('id');
        if ($specIds->isNotEmpty()) {
            ProductMainSpecColumn::whereIn('product_main_spec_id', $specIds)->delete();
        }
        ProductMainSpec::whereIn('product_id', $productIds)->delete();

        Product::whereIn('category_id', $categoryIds)->delete();
        CategoryAttribute::whereIn('category_id', $categoryIds)->delete();

        $this->info('  Очищено.');
    }

    // ─── Category Attributes ───────────────────────────────────

    /** @return array<string, int>  key → category_attribute_id */
    private function ensureCategoryAttributes(Category $category, array $attrs): array
    {
        $map = [];
        foreach ($attrs as $i => [$name, $key, $type, $unit]) {
            if ($this->dryRun) {
                $map[$key] = 0;
                continue;
            }

            $ca = CategoryAttribute::updateOrCreate(
                ['category_id' => $category->id, 'key' => $key],
                ['name' => $name, 'type' => $type, 'unit' => $unit, 'sort_order' => $i, 'is_required' => false]
            );
            $map[$key] = $ca->id;
        }
        return $map;
    }

    // ─── Collect Product URLs ──────────────────────────────────

    private function collectProductUrls(string $categorySlug): array
    {
        $urls = [];
        $page = 1;

        while (true) {
            $listUrl = $page === 1
                ? self::BASE . "/products/{$categorySlug}/"
                : self::BASE . "/products/{$categorySlug}/page/{$page}/";

            $html = $this->fetchHtml($listUrl);
            if (!$html) break;

            $crawler = new Crawler($html);

            $crawler->filter('a')->each(function (Crawler $a) use (&$urls, $categorySlug) {
                $href = $a->attr('href');
                if (!$href) return;
                $pattern = '#^https?://briarey\.ru/products/' . preg_quote($categorySlug, '#') . '/([a-z0-9\-\.,]+)/?$#i';
                if (preg_match($pattern, $href, $m)) {
                    $productUrl = rtrim($href, '/') . '/';
                    if (!in_array($productUrl, $urls) && !str_contains($m[1], 'page')) {
                        $urls[] = $productUrl;
                    }
                }
            });

            $hasNext = false;
            $nextPage = $page + 1;
            $crawler->filter('a')->each(function (Crawler $a) use ($nextPage, $categorySlug, &$hasNext) {
                $href = $a->attr('href') ?? '';
                if (str_contains($href, "/products/{$categorySlug}/page/{$nextPage}")) {
                    $hasNext = true;
                }
            });

            if (!$hasNext) break;
            $page++;
            usleep(300_000);
        }

        return $urls;
    }

    // ─── Scrape Single Product ─────────────────────────────────

    private function scrapeProduct(string $url, Category $category, array $attrMap, bool $hasKit): void
    {
        $html = $this->fetchHtml($url);
        if (!$html) {
            $this->warn("    ⚠ Не удалось загрузить");
            return;
        }

        $crawler = new Crawler($html);

        // Name
        $name = '';
        try { $name = trim($crawler->filter('h1')->first()->text('')); } catch (\Throwable $e) {}
        if (!$name) { $this->warn("    ⚠ Нет H1"); return; }

        $slug  = $this->extractSlugFromUrl($url);
        $price = $this->extractPrice($crawler);
        $imageUrls = $this->extractImages($crawler);

        // Full description text (between ЗАКАЗАТЬ and Сопутствующие товары)
        $descText = $this->extractDescriptionText($crawler);

        // Attributes (deduplicated by key)
        $attributes = $this->extractAttributes($descText);

        // Composition items (+ рукав ...)
        $composition = $this->extractComposition($crawler);

        // Related products (for kit items with images AND for extras)
        $relatedProducts = $this->extractRelatedProducts($crawler);

        // Text blocks → columns for a single main spec
        $columns = $this->extractSpecColumns($descText);

        $this->line("    ✓ {$name}");
        $this->line("      Цена: {$price} | Фото: " . count($imageUrls)
            . " | Атрибутов: " . count($attributes)
            . " | Колонки: " . count($columns)
            . " | Комплект: " . count($composition)
            . " | Сопутств: " . count($relatedProducts));

        if ($this->dryRun) return;

        // Download main image
        $mainImagePath = null;
        if (!empty($imageUrls)) {
            $mainImagePath = $this->downloadImage($imageUrls[0], 'products');
        }

        // Create/update product
        $product = Product::updateOrCreate(
            ['slug' => $slug],
            [
                'category_id'       => $category->id,
                'name'              => $name,
                'price'             => $price,
                'image'             => $mainImagePath,
                'badge'             => null,
                'calculator_hint'   => null,
                'technical_doc_url' => null,
                'is_active'         => true,
            ]
        );

        $this->productCount++;

        // ── Attributes (no duplicates)
        $product->attributeValues()->delete();
        foreach ($attributes as $key => $value) {
            if (isset($attrMap[$key]) && $attrMap[$key]) {
                ProductAttributeValue::create([
                    'product_id'            => $product->id,
                    'category_attribute_id' => $attrMap[$key],
                    'value'                 => $value,
                ]);
            }
        }

        // ── Images (gallery)
        $product->images()->delete();
        $seen = [];
        foreach ($imageUrls as $i => $imgUrl) {
            if (in_array($imgUrl, $seen)) continue;
            $seen[] = $imgUrl;

            $path = ($i === 0 && $mainImagePath)
                ? $mainImagePath
                : $this->downloadImage($imgUrl, 'products/gallery');

            if ($path) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image'      => $path,
                    'sort_order' => $i,
                ]);
            }
        }

        // ── Composition items
        $product->compositionItems()->delete();
        foreach ($composition as $i => $text) {
            ProductCompositionItem::create([
                'product_id' => $product->id,
                'text'       => $text,
                'sort_order' => $i,
            ]);
        }

        // ── Starter kit (only for categories with kits: dymososy, dymososy-dlya-pozharnyh-mashin)
        $product->starterKitItems()->delete();
        if ($hasKit && !empty($composition)) {
            $sortOrder = 0;

            // Main product is first kit item — use product's own main image
            ProductStarterKitItem::create([
                'product_id' => $product->id,
                'name'       => $name,
                'description'=> 'Основной товар',
                'image'      => $mainImagePath,
                'qty'        => '1 шт.',
                'sort_order' => $sortOrder++,
            ]);

            // Composition items as kit items — find images from related products by name matching
            foreach ($composition as $compText) {
                $parsed = $this->parseKitItem($compText);
                if (!$parsed) continue;

                // Try to find matching image from related products
                $kitImage = $this->findRelatedImage($parsed['name'], $relatedProducts);

                ProductStarterKitItem::create([
                    'product_id' => $product->id,
                    'name'       => $parsed['name'],
                    'description'=> $parsed['description'],
                    'image'      => $kitImage,
                    'qty'        => $parsed['qty'],
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        // ── Main specs: ONE "Назначение" spec with columns (matching seeder structure)
        $product->mainSpecs()->each(function ($spec) {
            $spec->columns()->delete();
            $spec->delete();
        });

        if (!empty($columns)) {
            $spec = ProductMainSpec::create([
                'product_id' => $product->id,
                'title'      => 'Назначение',
                'sort_order' => 0,
            ]);

            foreach ($columns as $i => $col) {
                ProductMainSpecColumn::create([
                    'product_main_spec_id' => $spec->id,
                    'heading'              => $col['heading'],
                    'content'              => $col['lines'],
                    'sort_order'           => $i,
                ]);
            }
        }

        // ── Collect related products for linking as extras (post-processing)
        if (!empty($relatedProducts)) {
            foreach ($relatedProducts as $rp) {
                $this->pendingExtras[] = [
                    'product_id'  => $product->id,
                    'related_slug'=> $rp['slug'],
                    'name'        => $rp['name'],
                    'image_url'   => $rp['image_url'],
                ];
            }
        }
    }

    // ─── Extraction Helpers ────────────────────────────────────

    private function extractSlugFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH);
        $segments = array_filter(explode('/', $path));
        return end($segments) ?: Str::random(10);
    }

    private function extractPrice(Crawler $crawler): int
    {
        $priceText = '';

        $crawler->filter('h5')->each(function (Crawler $h5) use (&$priceText) {
            $text = $h5->text('');
            if (preg_match('/[\d\s]+руб/iu', $text) && !$priceText) {
                $priceText = $text;
            }
        });

        if (!$priceText) {
            $text = $crawler->text('');
            if (preg_match('/Цена[^:]*:\s*(от\s*)?([\d\s]+)\s*руб/iu', $text, $m)) {
                $priceText = $m[2];
            }
        }

        return (int) preg_replace('/[^\d]/', '', $priceText);
    }

    private function extractImages(Crawler $crawler): array
    {
        $images = [];

        $crawler->filter('a[href*="/assets/uploads/"]')->each(function (Crawler $a) use (&$images) {
            $href = $a->attr('href');
            if ($href && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $href)) {
                $fullUrl = str_starts_with($href, 'http') ? $href : self::BASE . $href;
                if (!in_array($fullUrl, $images)) {
                    $images[] = $fullUrl;
                }
            }
        });

        if (empty($images)) {
            $crawler->filter('img[src*="/assets/uploads/"]')->each(function (Crawler $img) use (&$images) {
                $src = $img->attr('src');
                if ($src) {
                    $fullUrl = str_starts_with($src, 'http') ? $src : self::BASE . $src;
                    if (!in_array($fullUrl, $images)) {
                        $images[] = $fullUrl;
                    }
                }
            });
        }

        return $images;
    }

    /** Extract text between ЗАКАЗАТЬ and Сопутствующие товары */
    private function extractDescriptionText(Crawler $crawler): string
    {
        try {
            $fullHtml = $crawler->html();

            $content = '';
            if (preg_match('/ЗАКАЗАТЬ<\/a>(.*?)(?:Сопутствующие товары|<footer|class="footer")/sui', $fullHtml, $m)) {
                $content = $m[1];
            } elseif (preg_match('/ЗАКАЗАТЬ<\/a>(.*?)$/sui', $fullHtml, $m)) {
                $content = $m[1];
            }

            // Remove script/style blocks entirely (content + tags)
            $content = preg_replace('/<script\b[^>]*>.*?<\/script>/si', '', $content);
            $content = preg_replace('/<style\b[^>]*>.*?<\/style>/si', '', $content);

            $text = preg_replace('/<br\s*\/?>/i', "\n", $content);
            $text = strip_tags($text);
            $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
            $text = preg_replace('/[ \t]+/', ' ', $text);
            $text = preg_replace('/\n{3,}/', "\n\n", $text);
            return trim($text);
        } catch (\Throwable $e) {
            return '';
        }
    }

    /**
     * Parse attributes — first match per key wins (no duplicates).
     * @return array<string, string>  key → value
     */
    private function extractAttributes(string $text): array
    {
        if (!$text) return [];

        $attrs = [];
        foreach ($this->attrPatterns as [$pattern, $key]) {
            if (isset($attrs[$key])) continue;

            if (preg_match($pattern, $text, $m)) {
                $value = trim($m[1]);
                $value = preg_replace('/\s+/', ' ', $value);
                $value = rtrim($value, '. ');
                if ($value && mb_strlen($value) < 200) {
                    $attrs[$key] = $value;
                }
            }
        }

        return $attrs;
    }

    /** Extract composition items like "+ рукав всасывающий - 5м" */
    private function extractComposition(Crawler $crawler): array
    {
        $items = [];
        try {
            $text = $crawler->text('');

            // Match items starting with "+" and ending at next "+", ";" or "Заказать"
            if (preg_match_all('/\+\s*(рукав[^+;]*?(?:\d+\s*м))/ui', $text, $matches)) {
                foreach ($matches[0] as $match) {
                    $match = trim($match);
                    if (mb_strlen($match) > 5 && !in_array($match, $items)) {
                        $items[] = $match;
                    }
                }
            }

            // Fallback: broader pattern for адаптер, обвязка, комплект
            if (preg_match_all('/\+\s*([^+;]+)/u', $text, $matches)) {
                foreach ($matches[0] as $match) {
                    // Truncate at "Заказать" or first JS-like content
                    if (($pos = mb_strpos($match, 'Заказать')) !== false) {
                        $match = mb_substr($match, 0, $pos);
                    }
                    $match = trim($match);
                    $lower = mb_strtolower($match);
                    if (mb_strlen($match) > 5 && mb_strlen($match) < 120 &&
                        (str_contains($lower, 'адаптер') || str_contains($lower, 'обвязка') ||
                         str_contains($lower, 'комплект'))) {
                        if (!in_array($match, $items)) {
                            $items[] = $match;
                        }
                    }
                }
            }
        } catch (\Throwable $e) {}

        return $items;
    }

    /**
     * Parse "Сопутствующие товары" carousel for related product names + images + slugs.
     * @return list<array{name: string, image_url: string, slug: string|null}>
     */
    private function extractRelatedProducts(Crawler $crawler): array
    {
        $items = [];
        $seen = [];
        try {
            $crawler->filter('.relatedProductItem')->each(function (Crawler $div) use (&$items, &$seen) {
                $name = '';
                try { $name = trim($div->filter('h6')->first()->text('')); } catch (\Throwable $e) {}
                if (!$name) return;

                // Deduplicate by name
                if (isset($seen[$name])) return;
                $seen[$name] = true;

                $imgSrc = '';
                try { $imgSrc = $div->filter('img')->first()->attr('src') ?? ''; } catch (\Throwable $e) {}
                if (!$imgSrc) return;

                $imageUrl = str_starts_with($imgSrc, 'http') ? $imgSrc : self::BASE . $imgSrc;

                // Try to extract slug from href
                $slug = null;
                try {
                    $href = $div->filter('a')->first()->attr('href') ?? '';
                    if ($href) {
                        $path = parse_url($href, PHP_URL_PATH);
                        $segments = array_filter(explode('/', $path));
                        $slug = end($segments) ?: null;
                    }
                } catch (\Throwable $e) {}

                $items[] = [
                    'name'      => $name,
                    'image_url' => $imageUrl,
                    'slug'      => $slug,
                ];
            });
        } catch (\Throwable $e) {}

        return $items;
    }

    /**
     * Extract text blocks as columns for a single "Назначение" main spec.
     * Known headings → column headings; rest → "Описание:" column.
     * @return list<array{heading: string, lines: list<string>}>
     */
    private function extractSpecColumns(string $text): array
    {
        if (!$text) return [];

        // Strip attribute lines
        $text = $this->stripAttributeLines($text);
        // Strip payment/delivery noise
        $text = $this->stripNoise($text);
        $text = trim($text);
        if (mb_strlen($text) < 20) return [];

        $columns = [];

        $headings = [
            'Основное назначение',
            'Дополнительное применение',
            'Варианты изготовления',
            'Варианты исполнения электродвигателя',
            'Комплект поставки',
        ];

        // Split text by known headings
        $headingPattern = '(' . implode('|', array_map(fn($h) => preg_quote($h, '/'), $headings)) . ')\s*[:.]?\s*';
        $parts = preg_split('/(?=' . $headingPattern . ')/ui', $text, -1, PREG_SPLIT_NO_EMPTY);

        $seenHeadings = [];
        foreach ($parts as $part) {
            $part = trim($part);
            if (mb_strlen($part) < 10) continue;

            // Check if part starts with a known heading
            $heading = 'Описание';
            foreach ($headings as $h) {
                if (mb_stripos($part, $h) === 0) {
                    $heading = $h;
                    $part = trim(mb_substr($part, mb_strlen($h)));
                    $part = ltrim($part, ':. ');
                    break;
                }
            }

            // Deduplicate by heading
            if (isset($seenHeadings[$heading])) continue;
            $seenHeadings[$heading] = true;

            $lines = array_values(array_filter(
                preg_split('/\n+/', trim($part)),
                fn($line) => mb_strlen(trim($line)) > 3
            ));
            $lines = array_map('trim', $lines);

            if (empty($lines)) continue;

            $columns[] = [
                'heading' => $heading . ':',
                'lines'   => $lines,
            ];
        }

        return $columns;
    }

    /** Strip attribute lines so they don't leak into spec columns. */
    private function stripAttributeLines(string $text): string
    {
        $patterns = [
            '/Габаритн\w+\s+размер\w*\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Масса\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Электродвигатель\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Двигатель\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Производительность\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Врезн\w+\s+размер\w*\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Предел\s+огнестойкости\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Площадь\s+проходного\s+сечения\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Давление\s+открытия\s*(?:заслонки)?\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
            '/Размер\w*\s+проема\s*[:.]\s*.+?(?:\.\s*(?=[А-ЯЁ])|\.\s*$)/mu',
        ];

        foreach ($patterns as $p) {
            $text = preg_replace($p, '', $text);
        }

        return $text;
    }

    /** Remove payment/delivery/price noise. */
    private function stripNoise(string $text): string
    {
        $patterns = [
            '/по\s+счёту.*?банковский\s+перевод/uis',
            '/по\s+Москве\s+бесплатно.*?(?:самовывоз[^.]*\.|Раменское\s*\.)/uis',
            '/ТК\s+П[эе]к.*?Раменское\s*\./uis',
            '/Наличие\s*:.*/ui',
            '/Цена\s+за\s+комплект.*/ui',
            '/Цена\s*:.*/ui',
            '/ОТ\s+\d[\d\s]*РУБ\.?/ui',
            '/\bОплата\b/ui',
            '/\bДоставка\b/ui',
            '/\bОписание\s*:\s*/ui',
            '/\bЗаказать\b/ui',
        ];

        foreach ($patterns as $p) {
            $text = preg_replace($p, '', $text);
        }

        return $text;
    }

    /** Parse "+ рукав всасывающий - 5м" → kit item. */
    private function parseKitItem(string $text): ?array
    {
        $text = ltrim($text, '+ ');
        $text = trim($text);

        if (preg_match('/^(.+?)\s*[-–—]\s*(\d+\s*м\b.*)/ui', $text, $m)) {
            $name = trim($m[1]);
            $qty  = trim($m[2]);
            $name = mb_strtoupper(mb_substr($name, 0, 1)) . mb_substr($name, 1);

            return [
                'name'        => $name,
                'description' => "Длина: {$qty}",
                'qty'         => $qty,
            ];
        }

        return [
            'name'        => mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1),
            'description' => null,
            'qty'         => '1 шт.',
        ];
    }

    /**
     * Find a matching related product image for a kit item by fuzzy name matching.
     * Composition text "рукав всасывающий" should match related "Всасывающая двухзонная обвязка" etc.
     *
     * @param  string  $kitName  Kit item name (e.g. "Рукав всасывающий")
     * @param  list<array{name: string, image_url: string}>  $relatedProducts
     * @return string|null  Downloaded image path or null
     */
    private function findRelatedImage(string $kitName, array $relatedProducts): ?string
    {
        if (empty($relatedProducts)) return null;

        $kitLower = mb_strtolower($kitName);

        // Extract keywords from kit name (2+ chars)
        $kitWords = preg_split('/[\s\-–—]+/u', $kitLower);
        $kitWords = array_filter($kitWords, fn($w) => mb_strlen($w) >= 3);

        $bestMatch = null;
        $bestScore = 0;

        foreach ($relatedProducts as $related) {
            $relLower = mb_strtolower($related['name']);

            // Count matching keywords
            $score = 0;
            foreach ($kitWords as $word) {
                if (mb_strpos($relLower, $word) !== false) {
                    $score++;
                }
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $related;
            }
        }

        // Require at least 1 keyword match
        if ($bestMatch && $bestScore >= 1) {
            return $this->downloadImage($bestMatch['image_url'], 'products/kit');
        }

        return null;
    }

    // ─── Link Related Products as Extras ───────────────────────

    /**
     * After all products are scraped, create ProductExtra records from related products.
     * Looks up each related product by slug in the DB and copies its name, price, image.
     */
    private function linkRelatedProductExtras(): void
    {
        $this->newLine();
        $this->info('═══ Привязка сопутствующих товаров как доп. оборудования ═══');

        $linked = 0;
        $skipped = 0;

        // Group by product_id to set sort_order sequentially
        $grouped = [];
        foreach ($this->pendingExtras as $pe) {
            $grouped[$pe['product_id']][] = $pe;
        }

        foreach ($grouped as $productId => $extras) {
            // Clear old extras for this product
            ProductExtra::where('product_id', $productId)->delete();

            $sortOrder = 0;
            $seenSlugs = [];

            foreach ($extras as $pe) {
                try {
                    $slug = $pe['related_slug'];

                    // Skip duplicates (same slug for same product)
                    if ($slug && isset($seenSlugs[$slug])) continue;
                    if ($slug) $seenSlugs[$slug] = true;

                    // Try to find in DB by slug
                    $relatedProduct = $slug ? Product::where('slug', $slug)->first() : null;

                    // Use existing product image if available, otherwise download
                    $imagePath = null;
                    if ($relatedProduct && $relatedProduct->image) {
                        $imagePath = $relatedProduct->image;
                    } elseif (!empty($pe['image_url'])) {
                        $imagePath = $this->downloadImage($pe['image_url'], 'products/extras');
                    }

                    ProductExtra::create([
                        'product_id'  => $productId,
                        'name'        => $relatedProduct ? $relatedProduct->name : $pe['name'],
                        'description' => $relatedProduct && $relatedProduct->badge ? $relatedProduct->badge : '',
                        'price'       => $relatedProduct ? $relatedProduct->price : 0,
                        'image'       => $imagePath,
                        'sort_order'  => $sortOrder++,
                    ]);

                    $linked++;
                    if ($linked <= 3) {
                        $this->line("    + [{$pe['name']}] slug={$slug} price=" . ($relatedProduct ? $relatedProduct->price : '?'));
                    }
                } catch (\Throwable $e) {
                    $this->warn("    ⚠ Ошибка привязки: {$e->getMessage()}");
                    $skipped++;
                }
            }
        }

        $this->info("  Привязано: {$linked} доп. товаров к " . count($grouped) . ' товарам');
    }

    // ─── Image Download ────────────────────────────────────────

    private function downloadImage(string $url, string $directory): ?string
    {
        try {
            $response = Http::timeout(30)->get($url);
            if (!$response->successful()) return null;

            $ext = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
            $filename = Str::random(20) . '.' . $ext;
            $path = "{$directory}/{$filename}";

            Storage::disk('public')->put($path, $response->body());
            $this->downloadedImages++;

            return $path;
        } catch (\Throwable $e) {
            $this->warn("    ⚠ Не удалось скачать: {$url}");
            return null;
        }
    }

    // ─── HTTP ──────────────────────────────────────────────────

    private function fetchHtml(string $url): ?string
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; BriareyMigration/1.0)',
                    'Accept'     => 'text/html',
                ])
                ->get($url);

            return $response->successful() ? $response->body() : null;
        } catch (\Throwable $e) {
            $this->warn("    ⚠ HTTP: {$e->getMessage()}");
            return null;
        }
    }
}
