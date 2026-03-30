<?php
namespace App\Filament\Resources\ContactFormTopicResource\Pages;
use App\Filament\Resources\ContactFormTopicResource;
use Filament\Resources\Pages\ListRecords;
class ListContactFormTopics extends ListRecords
{
    protected static string $resource = ContactFormTopicResource::class;
    protected function getHeaderActions(): array { return [\Filament\Actions\CreateAction::make()]; }
}
