<?php
namespace App\Filament\Resources\ContactFormTopicResource\Pages;
use App\Filament\Resources\ContactFormTopicResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditContactFormTopic extends EditRecord
{
    protected static string $resource = ContactFormTopicResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
