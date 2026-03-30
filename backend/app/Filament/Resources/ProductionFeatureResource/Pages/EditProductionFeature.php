<?php
namespace App\Filament\Resources\ProductionFeatureResource\Pages;
use App\Filament\Resources\ProductionFeatureResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditProductionFeature extends EditRecord
{
    protected static string $resource = ProductionFeatureResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
