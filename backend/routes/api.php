<?php

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\VacancyController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\DealerController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CalculatorController;
use Illuminate\Support\Facades\Route;

// Главная страница (все секции одним запросом)
Route::get('/home', [HomeController::class, 'index']);
Route::get('/site-settings', [HomeController::class, 'siteSettings']);

// Новости
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);

// Каталог
Route::get('/categories', [CatalogController::class, 'categories']);
Route::get('/categories/{slug}', [CatalogController::class, 'categoryProducts']);
Route::get('/products', [CatalogController::class, 'products']);
Route::get('/products/search', [CatalogController::class, 'search']);
Route::get('/products/{slug}', [CatalogController::class, 'product']);

// Сертификаты
Route::get('/certificates', [CertificateController::class, 'index']);

// Вакансии
Route::get('/vacancies', [VacancyController::class, 'index']);

// О компании
Route::get('/about', [AboutController::class, 'index']);

// Дилерам
Route::get('/dealers', [DealerController::class, 'index']);

// Контакты
Route::get('/contact-topics', [ContactController::class, 'topics']);
Route::post('/contact', [ContactController::class, 'submit']);
Route::post('/newsletter', [ContactController::class, 'subscribe']);

// Заказы
Route::post('/orders', [OrderController::class, 'store']);

// Калькулятор
Route::get('/calculator/recommend', [CalculatorController::class, 'recommend']);
