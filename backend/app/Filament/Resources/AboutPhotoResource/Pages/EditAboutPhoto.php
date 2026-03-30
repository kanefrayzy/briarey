<?php
namespace App\Filament\Resources\AboutPhotoResource\Pages;
use App\Filament\Resources\AboutPhotoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditAboutPhoto extends EditRecord
{
    protected static string $resource = AboutPhotoResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
