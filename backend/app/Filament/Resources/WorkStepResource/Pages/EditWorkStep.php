<?php
namespace App\Filament\Resources\WorkStepResource\Pages;
use App\Filament\Resources\WorkStepResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditWorkStep extends EditRecord
{
    protected static string $resource = WorkStepResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
