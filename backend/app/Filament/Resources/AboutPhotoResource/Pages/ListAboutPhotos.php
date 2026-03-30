<?php
namespace App\Filament\Resources\AboutPhotoResource\Pages;
use App\Filament\Resources\AboutPhotoResource;
use Filament\Resources\Pages\ListRecords;
class ListAboutPhotos extends ListRecords
{
    protected static string $resource = AboutPhotoResource::class;
    protected function getHeaderActions(): array { return [\Filament\Actions\CreateAction::make()]; }
}
