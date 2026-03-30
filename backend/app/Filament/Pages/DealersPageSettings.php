<?php

namespace App\Filament\Pages;

use App\Models\DealersPage;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class DealersPageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Дилерам';
    protected static ?string $title = 'Страница «Дилерам»';
    protected static \UnitEnum|string|null $navigationGroup = 'Страницы';
    protected static ?int $navigationSort = 2;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = DealersPage::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Hero-секция')->schema([
                    TextInput::make('hero_title')->label('Заголовок')->required(),
                    Textarea::make('hero_description')->label('Описание')->rows(3),
                    TextInput::make('hero_button_text')->label('Текст кнопки'),
                    FileUpload::make('hero_image')->label('Изображение')->image()->disk('public')->directory('dealers'),
                ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        DealersPage::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
