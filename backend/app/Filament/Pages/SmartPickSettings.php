<?php

namespace App\Filament\Pages;

use App\Models\SmartPickSection;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SmartPickSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-device-phone-mobile';
    protected static ?string $navigationLabel = 'Умный подбор';
    protected static ?string $title = 'Умный подбор оборудования';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 3;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = SmartPickSection::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Контент')->schema([
                    TextInput::make('title')->label('Заголовок')->required(),
                    Textarea::make('description')->label('Описание')->rows(3),
                    TextInput::make('button_text')->label('Текст кнопки'),
                    TextInput::make('button_link')->label('Ссылка кнопки'),
                    FileUpload::make('image')->label('Изображение')->image()->disk('public')->directory('smart-pick'),
                ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        SmartPickSection::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
