<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-squares-2x2';
    protected static ?string $navigationLabel = 'Категории';
    protected static ?string $modelLabel = 'Категория';
    protected static ?string $pluralModelLabel = 'Категории';
    protected static \UnitEnum|string|null $navigationGroup = 'Каталог';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Schemas\Components\Section::make('Основное')->schema([
                Forms\Components\TextInput::make('name')->label('Название')->required(),
                Forms\Components\TextInput::make('slug')->label('URL (slug)')->required()->unique(ignoreRecord: true),
                Forms\Components\FileUpload::make('icon')->label('Иконка')->image()->disk('public')->directory('categories'),
                Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                Forms\Components\Toggle::make('is_active')->label('Активна')->default(true),
            ])->columns(2),

            Schemas\Components\Section::make('Атрибуты товаров этой категории')->schema([
                Forms\Components\Repeater::make('attributes')
                    ->relationship()
                    ->label('Атрибуты')
                    ->schema([
                        Forms\Components\TextInput::make('name')->label('Название')->required(),
                        Forms\Components\TextInput::make('key')->label('Ключ (slug)')->required(),
                        Forms\Components\Select::make('type')->label('Тип')
                            ->options(['text' => 'Текст', 'number' => 'Число', 'select' => 'Выбор'])
                            ->default('text')->required(),
                        Forms\Components\TextInput::make('unit')->label('Единица измерения'),
                        Forms\Components\TagsInput::make('options')->label('Варианты (для типа «Выбор»)'),
                        Forms\Components\Toggle::make('is_required')->label('Обязателен'),
                        Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
                    ])
                    ->columns(3)
                    ->collapsible()
                    ->orderColumn('sort_order'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\ImageColumn::make('icon')->label('Иконка'),
                Tables\Columns\TextColumn::make('name')->label('Название')->searchable(),
                Tables\Columns\TextColumn::make('slug')->label('Slug'),
                Tables\Columns\TextColumn::make('products_count')->counts('products')->label('Товаров'),
                Tables\Columns\IconColumn::make('is_active')->label('Активна')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
