<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DealerStepResource\Pages;
use App\Models\DealerStep;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class DealerStepResource extends Resource
{
    protected static ?string $model = DealerStep::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-numbered-list';
    protected static ?string $navigationLabel = 'Шаги дилерам';
    protected static ?string $modelLabel = 'Шаг';
    protected static ?string $pluralModelLabel = 'Шаги для дилеров';
    protected static \UnitEnum|string|null $navigationGroup = 'Контент';
    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Заголовок')->required(),
            Forms\Components\Textarea::make('description')->label('Описание')->rows(3),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\TextColumn::make('title')->label('Заголовок')->searchable(),
                Tables\Columns\TextColumn::make('description')->label('Описание')->limit(60),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDealerSteps::route('/'),
            'create' => Pages\CreateDealerStep::route('/create'),
            'edit' => Pages\EditDealerStep::route('/{record}/edit'),
        ];
    }
}
