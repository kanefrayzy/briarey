<?php

namespace App\Filament\Pages;

use App\Models\CertificatesPage;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class CertificatesPageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationLabel = 'Сертификаты (стр.)';
    protected static ?string $title = 'Страница «Сертификаты»';
    protected static \UnitEnum|string|null $navigationGroup = 'Страницы';
    protected static ?int $navigationSort = 3;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    public function mount(): void
    {
        $record = CertificatesPage::firstOrCreate([]);
        $this->form->fill($record->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Hero-секция')->schema([
                    TextInput::make('hero_title')->label('Заголовок'),
                    TextInput::make('hero_description')->label('Описание'),
                    FileUpload::make('hero_image')->label('Изображение')->image()->disk('public')->directory('certificates-page'),
                ]),
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
        CertificatesPage::updateOrCreate(['id' => 1], $data);
        Notification::make()->title('Сохранено')->success()->send();
    }
}
