<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use App\Models\Category;
use App\Models\CategoryAttribute;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationLabel = 'Товары';
    protected static ?string $modelLabel = 'Товар';
    protected static ?string $pluralModelLabel = 'Товары';
    protected static \UnitEnum|string|null $navigationGroup = 'Каталог';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Schemas\Components\Section::make('Основное')->schema([
                Forms\Components\Select::make('category_id')
                    ->label('Категория')
                    ->relationship('category', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->live(),
                Forms\Components\TextInput::make('name')->label('Название')->required(),
                Forms\Components\TextInput::make('slug')->label('URL (slug)')->required()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('badge')->label('Бейдж'),
                Forms\Components\TextInput::make('price')->label('Цена')->numeric()->prefix('₽'),
                Forms\Components\FileUpload::make('image')->label('Основное фото')->image()->disk('public')->directory('products'),
                Forms\Components\TextInput::make('calculator_hint')->label('Подсказка калькулятора'),
                Forms\Components\TextInput::make('technical_doc_url')->label('URL тех. документации'),
                Forms\Components\Toggle::make('is_active')->label('Активен')->default(true),
            ])->columns(2),

            Schemas\Components\Section::make('Характеристики товара')
                ->description('Динамические характеристики из шаблона категории (EAV)')
                ->schema([
                    Forms\Components\Repeater::make('attributeValues')
                        ->relationship()
                        ->label('Характеристики')
                        ->schema(fn (Schemas\Components\Utilities\Get $get): array => [
                            Forms\Components\Select::make('category_attribute_id')
                                ->label('Характеристика')
                                ->options(function () use ($get) {
                                    $categoryId = $get('category_id');
                                    if (!$categoryId) return [];
                                    return CategoryAttribute::where('category_id', $categoryId)
                                        ->orderBy('sort_order')
                                        ->pluck('name', 'id');
                                })
                                ->required()
                                ->disableOptionsWhenSelectedInSiblingRepeaterItems(),
                            Forms\Components\TextInput::make('value')
                                ->label('Значение')
                                ->required()
                                ->placeholder('Например: 1500 м³/час'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->defaultItems(0),
                ]),

            Schemas\Components\Section::make('Галерея')->schema([
                Forms\Components\Repeater::make('images')
                    ->relationship()
                    ->label('Доп. изображения')
                    ->schema([
                        Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('products/gallery')->required(),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),

            Schemas\Components\Section::make('Состав комплекта')->schema([
                Forms\Components\Repeater::make('compositionItems')
                    ->relationship()
                    ->label('Элементы состава')
                    ->schema([
                        Forms\Components\TextInput::make('text')->label('Название')->required(),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),

            Schemas\Components\Section::make('Стартовый комплект')->schema([
                Forms\Components\Repeater::make('starterKitItems')
                    ->relationship()
                    ->label('Позиции')
                    ->schema([
                        Forms\Components\TextInput::make('name')->label('Название')->required(),
                        Forms\Components\Textarea::make('description')->label('Описание')->rows(2),
                        Forms\Components\FileUpload::make('image')->label('Фото')->image()->disk('public')->directory('products/kit'),
                        Forms\Components\TextInput::make('qty')->label('Кол-во')->numeric(),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),

            Schemas\Components\Section::make('Основные спецификации')->schema([
                Forms\Components\Repeater::make('mainSpecs')
                    ->relationship()
                    ->label('Таблицы характеристик')
                    ->schema([
                        Forms\Components\TextInput::make('title')->label('Заголовок таблицы')->required(),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                        Forms\Components\Repeater::make('columns')
                            ->relationship()
                            ->label('Колонки')
                            ->schema([
                                Forms\Components\TextInput::make('heading')->label('Заголовок колонки')->required(),
                                Forms\Components\TagsInput::make('content')->label('Значения (строки)'),
                                Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                            ])
                            ->columns(3)
                            ->collapsible()
                            ->orderColumn('sort_order'),
                    ])
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),

            Schemas\Components\Section::make('Дополнительное оборудование')->schema([
                Forms\Components\Repeater::make('extras')
                    ->relationship()
                    ->label('Доп. оборудование')
                    ->schema([
                        Forms\Components\TextInput::make('name')->label('Название')->required(),
                        Forms\Components\Textarea::make('description')->label('Описание')->rows(2),
                        Forms\Components\TextInput::make('price')->label('Цена')->numeric()->prefix('₽'),
                        Forms\Components\FileUpload::make('image')->label('Фото')->image()->disk('public')->directory('products/extras'),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('Фото'),
                Tables\Columns\TextColumn::make('name')->label('Название')->searchable(),
                Tables\Columns\TextColumn::make('category.name')->label('Категория')->sortable(),
                Tables\Columns\TextColumn::make('badge')->label('Бейдж')->badge(),
                Tables\Columns\TextColumn::make('price')->label('Цена')->money('RUB'),
                Tables\Columns\IconColumn::make('is_active')->label('Активен')->boolean(),
            ])
            ->defaultSort('name')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
