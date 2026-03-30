<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Настройки сайта';
    protected static ?string $title = 'Настройки сайта';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 1;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = SiteSetting::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Контакты')->schema([
                    TextInput::make('phone_1')->label('Телефон 1'),
                    TextInput::make('phone_2')->label('Телефон 2'),
                    TextInput::make('email')->label('Email')->email(),
                    TextInput::make('work_hours')->label('Часы работы'),
                    TextInput::make('address')->label('Адрес'),
                ])->columns(2),
                Section::make('Реквизиты')->schema([
                    TextInput::make('company_name')->label('Название компании'),
                    TextInput::make('inn')->label('ИНН'),
                    TextInput::make('ogrn')->label('ОГРН'),
                    TextInput::make('okpo')->label('ОКПО'),
                ])->columns(2),
                Section::make('Соцсети')->schema([
                    TextInput::make('facebook_url')->label('Facebook')->url(),
                    TextInput::make('youtube_url')->label('YouTube')->url(),
                    TextInput::make('instagram_url')->label('Instagram')->url(),
                    TextInput::make('twitter_url')->label('Twitter')->url(),
                ])->columns(2),
                Section::make('Логотип')->schema([
                    FileUpload::make('logo')->label('Логотип')->image()->disk('public')->directory('settings'),
                ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        SiteSetting::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
