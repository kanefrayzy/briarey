<?php
namespace App\Filament\Resources\ProductionFeatureResource\Pages;
use App\Filament\Resources\ProductionFeatureResource;
use Filament\Resources\Pages\ListRecords;
class ListProductionFeatures extends ListRecords
{
    protected static string $resource = ProductionFeatureResource::class;
    protected function getHeaderActions(): array { return [\Filament\Actions\CreateAction::make()]; }
}
