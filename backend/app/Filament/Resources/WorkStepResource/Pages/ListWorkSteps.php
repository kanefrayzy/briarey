<?php
namespace App\Filament\Resources\WorkStepResource\Pages;
use App\Filament\Resources\WorkStepResource;
use Filament\Resources\Pages\ListRecords;
class ListWorkSteps extends ListRecords
{
    protected static string $resource = WorkStepResource::class;
    protected function getHeaderActions(): array { return [\Filament\Actions\CreateAction::make()]; }
}
