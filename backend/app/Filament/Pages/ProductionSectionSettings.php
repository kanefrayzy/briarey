<?php

namespace App\Filament\Pages;

use App\Models\ProductionSection;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ProductionSectionSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationLabel = 'Производство (секция)';
    protected static ?string $title = 'Секция «Производство»';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 5;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = ProductionSection::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Контент')->schema([
                    TextInput::make('title')->label('Заголовок'),
                    TextInput::make('subtitle')->label('Подзаголовок'),
                    TextInput::make('button_text')->label('Текст кнопки'),
                    TextInput::make('button_link')->label('Ссылка кнопки'),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        ProductionSection::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
