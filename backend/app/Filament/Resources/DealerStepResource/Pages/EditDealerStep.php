<?php
namespace App\Filament\Resources\DealerStepResource\Pages;
use App\Filament\Resources\DealerStepResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditDealerStep extends EditRecord
{
    protected static string $resource = DealerStepResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
