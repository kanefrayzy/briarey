<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkStepResource\Pages;
use App\Models\WorkStep;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class WorkStepResource extends Resource
{
    protected static ?string $model = WorkStep::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-list-bullet';
    protected static ?string $navigationLabel = 'Схема работы';
    protected static ?string $modelLabel = 'Шаг';
    protected static ?string $pluralModelLabel = 'Схема работы';
    protected static \UnitEnum|string|null $navigationGroup = 'Главная';
    protected static ?int $navigationSort = 3;

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
            'index' => Pages\ListWorkSteps::route('/'),
            'create' => Pages\CreateWorkStep::route('/create'),
            'edit' => Pages\EditWorkStep::route('/{record}/edit'),
        ];
    }
}
