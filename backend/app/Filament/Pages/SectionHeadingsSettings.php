<?php

namespace App\Filament\Pages;

use App\Models\SectionSetting;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SectionHeadingsSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-bars-3';
    protected static ?string $navigationLabel = 'Заголовки секций';
    protected static ?string $title = 'Заголовки секций главной';
    protected static \UnitEnum|string|null $navigationGroup = 'Настройки';
    protected static ?int $navigationSort = 6;
    protected string $view = 'filament.pages.settings-form';

    public ?array $data = [];

    protected array $sectionKeys = [
        'advantages' => 'Преимущества',
        'work_steps' => 'Схема работы',
        'partners' => 'Партнёры',
        'production' => 'Производство',
        'faq' => 'FAQ',
        'news' => 'Новости',
        'catalog' => 'Каталог',
    ];

    public function mount(): void
    {
        $settings = SectionSetting::all()->keyBy('section_key');
        $data = [];
        foreach ($this->sectionKeys as $key => $label) {
            $record = $settings->get($key);
            $data[$key] = [
                'title' => $record?->title ?? '',
                'subtitle' => $record?->subtitle ?? '',
                'button_text' => $record?->button_text ?? '',
                'button_link' => $record?->button_link ?? '',
            ];
        }
        $this->form->fill($data);
    }

    public function form(Schema $schema): Schema
    {
        $sections = [];
        foreach ($this->sectionKeys as $key => $label) {
            $sections[] = Section::make($label)->schema([
                TextInput::make("{$key}.title")->label('Заголовок'),
                TextInput::make("{$key}.subtitle")->label('Подзаголовок'),
                TextInput::make("{$key}.button_text")->label('Текст кнопки'),
                TextInput::make("{$key}.button_link")->label('Ссылка кнопки'),
            ])->columns(2)->collapsible();
        }

        return $schema->schema($sections)->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        foreach ($this->sectionKeys as $key => $label) {
            if (isset($data[$key])) {
                SectionSetting::updateOrCreate(
                    ['section_key' => $key],
                    $data[$key]
                );
            }
        }
        Notification::make()->title('Сохранено')->success()->send();
    }
}
