<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsResource\Pages;
use App\Models\News;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationLabel = 'Новости';
    protected static ?string $modelLabel = 'Новость';
    protected static ?string $pluralModelLabel = 'Новости';
    protected static \UnitEnum|string|null $navigationGroup = 'Контент';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Schemas\Components\Section::make('Основное')->schema([
                Forms\Components\TextInput::make('title')->label('Заголовок')->required(),
                Forms\Components\TextInput::make('slug')->label('URL (slug)')->required()->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('excerpt')->label('Краткое описание')->rows(3),
                Forms\Components\DatePicker::make('date')->label('Дата')->required(),
                Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('news'),
                Forms\Components\Toggle::make('is_featured')->label('Избранная'),
                Forms\Components\Toggle::make('is_published')->label('Опубликована')->default(true),
            ])->columns(2),

            Schemas\Components\Section::make('Содержимое')->schema([
                Forms\Components\Repeater::make('contentBlocks')
                    ->relationship()
                    ->label('Блоки контента')
                    ->schema([
                        Forms\Components\TextInput::make('title')->label('Заголовок блока'),
                        Forms\Components\RichEditor::make('text')->label('Текст'),
                        Forms\Components\FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('news/blocks'),
                        Forms\Components\Toggle::make('has_play_icon')->label('Иконка Play'),
                        Forms\Components\Toggle::make('is_reversed')->label('Обратный порядок'),
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
                Tables\Columns\TextColumn::make('title')->label('Заголовок')->searchable()->limit(50),
                Tables\Columns\TextColumn::make('date')->label('Дата')->date('d.m.Y')->sortable(),
                Tables\Columns\IconColumn::make('is_published')->label('Опубл.')->boolean(),
                Tables\Columns\IconColumn::make('is_featured')->label('Избр.')->boolean(),
            ])
            ->defaultSort('date', 'desc')
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit' => Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
