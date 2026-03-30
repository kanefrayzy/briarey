<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AboutPhotoResource\Pages;
use App\Models\AboutPhoto;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class AboutPhotoResource extends Resource
{
    protected static ?string $model = AboutPhoto::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-camera';
    protected static ?string $navigationLabel = 'Фото (о компании)';
    protected static ?string $modelLabel = 'Фото';
    protected static ?string $pluralModelLabel = 'Фото слайдер «О компании»';
    protected static \UnitEnum|string|null $navigationGroup = 'Контент';
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('about')->required(),
            Forms\Components\TextInput::make('alt')->label('Alt текст'),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\ImageColumn::make('image')->label('Фото'),
                Tables\Columns\TextColumn::make('alt')->label('Alt'),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAboutPhotos::route('/'),
            'create' => Pages\CreateAboutPhoto::route('/create'),
            'edit' => Pages\EditAboutPhoto::route('/{record}/edit'),
        ];
    }
}
