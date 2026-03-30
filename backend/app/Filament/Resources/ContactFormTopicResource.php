<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactFormTopicResource\Pages;
use App\Models\ContactFormTopic;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class ContactFormTopicResource extends Resource
{
    protected static ?string $model = ContactFormTopic::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationLabel = 'Темы обращений';
    protected static ?string $modelLabel = 'Тема';
    protected static ?string $pluralModelLabel = 'Темы обращений';
    protected static \UnitEnum|string|null $navigationGroup = 'Заявки';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('label')->label('Название')->required(),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Активна')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\TextColumn::make('label')->label('Название')->searchable(),
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
            'index' => Pages\ListContactFormTopics::route('/'),
            'create' => Pages\CreateContactFormTopic::route('/create'),
            'edit' => Pages\EditContactFormTopic::route('/{record}/edit'),
        ];
    }
}
