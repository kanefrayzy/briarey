<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SlideResource\Pages;
use App\Models\Slide;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class SlideResource extends Resource
{
    protected static ?string $model = Slide::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Слайды';
    protected static ?string $modelLabel = 'Слайд';
    protected static ?string $pluralModelLabel = 'Слайды';
    protected static \UnitEnum|string|null $navigationGroup = 'Главная';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Заголовок')->required(),
            Forms\Components\TextInput::make('subtitle')->label('Подзаголовок'),
            Forms\Components\TextInput::make('stat_title')->label('Статистика (число)'),
            Forms\Components\TextInput::make('stat_description')->label('Статистика (описание)'),
            Forms\Components\TextInput::make('next_feature')->label('Следующий слайд (превью текст)'),
            Forms\Components\TextInput::make('button_text')->label('Текст кнопки'),
            Forms\Components\TextInput::make('button_link')->label('Ссылка кнопки'),
            Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('slides'),
            Forms\Components\FileUpload::make('icon')->label('Иконка')->image()->disk('public')->directory('slides/icons'),
            Forms\Components\TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Активен')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sort_order')->label('№')->sortable(),
                Tables\Columns\ImageColumn::make('image')->label('Изображение'),
                Tables\Columns\TextColumn::make('title')->label('Заголовок')->searchable(),
                Tables\Columns\IconColumn::make('is_active')->label('Активен')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSlides::route('/'),
            'create' => Pages\CreateSlide::route('/create'),
            'edit' => Pages\EditSlide::route('/{record}/edit'),
        ];
    }
}
