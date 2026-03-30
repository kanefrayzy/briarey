<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CertificateResource\Pages;
use App\Models\Certificate;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class CertificateResource extends Resource
{
    protected static ?string $model = Certificate::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationLabel = 'Сертификаты';
    protected static ?string $modelLabel = 'Сертификат';
    protected static ?string $pluralModelLabel = 'Сертификаты';
    protected static \UnitEnum|string|null $navigationGroup = 'Контент';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Название')->required(),
            Forms\Components\FileUpload::make('image')->label('Изображение (превью)')->image()->disk('public')->directory('certificates'),
            Forms\Components\FileUpload::make('file')->label('Файл (PDF)')->disk('public')->directory('certificates/files')->acceptedFileTypes(['application/pdf', 'image/*']),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Активен')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\ImageColumn::make('image')->label('Превью'),
                Tables\Columns\TextColumn::make('title')->label('Название')->searchable(),
                Tables\Columns\IconColumn::make('is_active')->label('Активен')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCertificates::route('/'),
            'create' => Pages\CreateCertificate::route('/create'),
            'edit' => Pages\EditCertificate::route('/{record}/edit'),
        ];
    }
}
