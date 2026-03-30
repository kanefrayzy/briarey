<?php

namespace App\Filament\Pages;

use App\Models\CalculatorCta;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class CalculatorCtaSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-calculator';
    protected static ?string $navigationLabel = 'CTA Калькулятор';
    protected static ?string $title = 'Блок CTA Калькулятор';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 4;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = CalculatorCta::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Контент')->schema([
                    TextInput::make('title')->label('Заголовок')->required(),
                    TextInput::make('title_highlight')->label('Выделенная часть заголовка'),
                    Textarea::make('description')->label('Описание')->rows(3),
                    TextInput::make('button_text')->label('Текст кнопки'),
                    TextInput::make('button_link')->label('Ссылка кнопки'),
                    FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('cta'),
                ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        CalculatorCta::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
