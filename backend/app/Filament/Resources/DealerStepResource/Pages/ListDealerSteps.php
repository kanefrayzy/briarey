<?php
namespace App\Filament\Resources\DealerStepResource\Pages;
use App\Filament\Resources\DealerStepResource;
use Filament\Resources\Pages\ListRecords;
class ListDealerSteps extends ListRecords
{
    protected static string $resource = DealerStepResource::class;
    protected function getHeaderActions(): array { return [\Filament\Actions\CreateAction::make()]; }
}
