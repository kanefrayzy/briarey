<?php

namespace App\Filament\Pages;

use App\Models\AboutPage;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class AboutPageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-information-circle';
    protected static ?string $navigationLabel = 'О компании';
    protected static ?string $title = 'Страница «О компании»';
    protected static \UnitEnum|string|null $navigationGroup = 'Страницы';
    protected static ?int $navigationSort = 1;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = AboutPage::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Видео')->schema([
                    TextInput::make('video_url')->label('URL видео')->url(),
                    FileUpload::make('poster_image')->label('Постер видео')->image()->disk('public')->directory('about'),
                ])->columns(2),
                Section::make('Колонка 1')->schema([
                    TextInput::make('column_1_title')->label('Заголовок'),
                    RichEditor::make('column_1_text')->label('Текст'),
                ]),
                Section::make('Колонка 2')->schema([
                    TextInput::make('column_2_title')->label('Заголовок'),
                    RichEditor::make('column_2_text')->label('Текст'),
                ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        AboutPage::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
