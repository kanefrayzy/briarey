<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductionFeatureResource\Pages;
use App\Models\ProductionFeature;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class ProductionFeatureResource extends Resource
{
    protected static ?string $model = ProductionFeature::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-wrench-screwdriver';
    protected static ?string $navigationLabel = 'Производство (факты)';
    protected static ?string $modelLabel = 'Факт о производстве';
    protected static ?string $pluralModelLabel = 'Факты о производстве';
    protected static \UnitEnum|string|null $navigationGroup = 'Главная';
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Заголовок')->required(),
            Forms\Components\Textarea::make('description')->label('Описание')->rows(3),
            Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('production'),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\TextColumn::make('title')->label('Заголовок')->searchable(),
                Tables\Columns\TextColumn::make('description')->label('Описание')->limit(50),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProductionFeatures::route('/'),
            'create' => Pages\CreateProductionFeature::route('/create'),
            'edit' => Pages\EditProductionFeature::route('/{record}/edit'),
        ];
    }
}
