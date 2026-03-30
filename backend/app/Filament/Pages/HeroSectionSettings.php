<?php

namespace App\Filament\Pages;

use App\Models\HeroSection;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class HeroSectionSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-rectangle-group';
    protected static ?string $navigationLabel = 'Главный экран';
    protected static ?string $title = 'Главный экран (Hero)';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 2;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = HeroSection::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Основной заголовок')->schema([
                    TextInput::make('title')->label('Заголовок')->required(),
                    TextInput::make('subtitle')->label('Подзаголовок'),
                    TextInput::make('cta_text')->label('Текст кнопки'),
                    TextInput::make('cta_link')->label('Ссылка кнопки'),
                ])->columns(2),
                Section::make('Карточка калькулятора')->schema([
                    TextInput::make('card_title')->label('Заголовок карточки'),
                    TextInput::make('card_description')->label('Описание карточки'),
                    TextInput::make('card_button_text')->label('Текст кнопки'),
                    TextInput::make('card_button_link')->label('Ссылка кнопки'),
                ])->columns(2),
                Section::make('Изображения')->schema([
                    FileUpload::make('background_image')->label('Фоновое изображение')->image()->disk('public')->directory('hero'),
                    FileUpload::make('product_image')->label('Изображение продукта')->image()->disk('public')->directory('hero'),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        HeroSection::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
