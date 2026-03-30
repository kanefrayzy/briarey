<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Exports\ProductsExport;
use App\Imports\ProductsImport;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Maatwebsite\Excel\Facades\Excel;

class ListProducts extends ListRecords
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('export')
                ->label('Экспорт Excel')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success')
                ->action(function () {
                    return Excel::download(new ProductsExport(), 'products_' . date('Y-m-d') . '.xlsx');
                }),

            Actions\Action::make('import')
                ->label('Импорт Excel')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('warning')
                ->form([
                    Forms\Components\FileUpload::make('file')
                        ->label('Файл Excel (.xlsx)')
                        ->acceptedFileTypes([
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/vnd.ms-excel',
                        ])
                        ->required()
                        ->disk('local')
                        ->directory('imports')
                        ->visibility('private'),
                ])
                ->action(function (array $data) {
                    $filePath = $data['file'];
                    $disk     = \Illuminate\Support\Facades\Storage::disk('local');
                    $fullPath = $disk->path($filePath);

                    $import = new ProductsImport();
                    Excel::import($import, $fullPath);

                    $disk->delete($filePath);

                    $results = $import->getResults();
                    $lines   = [];

                    foreach ($results->all() as $sheet => $info) {
                        $parts = [];
                        if (!empty($info['updated'])) {
                            $parts[] = "обновлено: {$info['updated']}";
                        }
                        if (!empty($info['created'])) {
                            $parts[] = "создано: {$info['created']}";
                        }
                        if ($parts) {
                            $lines[] = ucfirst($sheet) . ': ' . implode(', ', $parts);
                        }
                        if (!empty($info['errors'])) {
                            foreach ($info['errors'] as $err) {
                                $lines[] = "⚠ {$err}";
                            }
                        }
                    }

                    $message = $lines ? implode("\n", $lines) : 'Нет изменений';

                    Notification::make()
                        ->title('Импорт завершён')
                        ->body($message)
                        ->success()
                        ->persistent()
                        ->send();
                })
                ->requiresConfirmation()
                ->modalHeading('Импорт товаров из Excel')
                ->modalDescription('Загрузите файл Excel, полученный через экспорт. Существующие записи будут обновлены по ID, новые — созданы.')
                ->modalSubmitActionLabel('Импортировать'),

            Actions\CreateAction::make(),
        ];
    }
}
