<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactSubmissionResource\Pages;
use App\Models\ContactSubmission;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class ContactSubmissionResource extends Resource
{
    protected static ?string $model = ContactSubmission::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationLabel = 'Обращения';
    protected static ?string $modelLabel = 'Обращение';
    protected static ?string $pluralModelLabel = 'Обращения';
    protected static \UnitEnum|string|null $navigationGroup = 'Заявки';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Имя')->disabled(),
            Forms\Components\TextInput::make('phone')->label('Телефон')->disabled(),
            Forms\Components\TextInput::make('email')->label('Email')->disabled(),
            Forms\Components\TextInput::make('topic')->label('Тема')->disabled(),
            Forms\Components\Textarea::make('message')->label('Сообщение')->disabled()->rows(5),
            Forms\Components\Toggle::make('is_subscribed')->label('Подписка на рассылку')->disabled(),
            Forms\Components\Toggle::make('is_read')->label('Прочитано'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')->label('Дата')->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('name')->label('Имя')->searchable(),
                Tables\Columns\TextColumn::make('phone')->label('Телефон'),
                Tables\Columns\TextColumn::make('topic')->label('Тема'),
                Tables\Columns\IconColumn::make('is_read')->label('Прочит.')->boolean(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([Actions\ViewAction::make(), Actions\EditAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactSubmissions::route('/'),
            'view' => Pages\ViewContactSubmission::route('/{record}'),
            'edit' => Pages\EditContactSubmission::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
