<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Actions;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationLabel = 'Заказы';
    protected static ?string $modelLabel = 'Заказ';
    protected static ?string $pluralModelLabel = 'Заказы';
    protected static \UnitEnum|string|null $navigationGroup = 'Заявки';
    protected static ?int $navigationSort = 2;

    public static function getNavigationBadge(): ?string
    {
        $count = Order::where('status', 'new')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Schemas\Components\Section::make('Заказ')->schema([
                Forms\Components\TextInput::make('number')->label('Номер заказа')->disabled(),
                Forms\Components\Select::make('status')->label('Статус')
                    ->options([
                        'new'        => 'Новый',
                        'processing' => 'В обработке',
                        'completed'  => 'Завершён',
                        'cancelled'  => 'Отменён',
                    ])->required(),
                Forms\Components\TextInput::make('total')->label('Сумма (₽)')->disabled(),
                Forms\Components\Select::make('delivery_method')->label('Способ получения')
                    ->options(['delivery' => 'Доставка', 'pickup' => 'Самовывоз'])->disabled(),
                Forms\Components\Select::make('recipient_type')->label('Тип получателя')
                    ->options(['legal' => 'Юр. лицо', 'individual' => 'Физ. лицо'])->disabled(),
            ])->columns(2),

            Schemas\Components\Section::make('Контакты')->schema([
                Forms\Components\TextInput::make('name')->label('Имя')->disabled(),
                Forms\Components\TextInput::make('phone')->label('Телефон')->disabled(),
                Forms\Components\TextInput::make('email')->label('Email')->disabled(),
                Forms\Components\Textarea::make('requisites')->label('Реквизиты')->disabled()->rows(3),
            ])->columns(2),

            Schemas\Components\Section::make('Адрес доставки')->schema([
                Forms\Components\TextInput::make('address')->label('Адрес')->disabled(),
                Forms\Components\TextInput::make('entrance')->label('Подъезд')->disabled(),
                Forms\Components\TextInput::make('floor')->label('Этаж')->disabled(),
                Forms\Components\TextInput::make('apartment')->label('Квартира/офис')->disabled(),
                Forms\Components\Textarea::make('comment')->label('Комментарий')->disabled()->rows(3),
            ])->columns(2),

            Schemas\Components\Section::make('Товары')->schema([
                Forms\Components\Repeater::make('items')
                    ->relationship()
                    ->label('')
                    ->schema([
                        Forms\Components\TextInput::make('product_name')->label('Товар')->disabled()->columnSpanFull(),
                        Forms\Components\TextInput::make('qty')->label('Кол-во')->disabled(),
                        Forms\Components\TextInput::make('price')->label('Цена (₽)')->disabled(),

                        Forms\Components\Placeholder::make('extras_display')
                            ->label('Доп. оборудование')
                            ->columnSpanFull()
                            ->content(function ($record) {
                                if (!$record || empty($record->extras)) return '—';
                                return collect($record->extras)->map(function ($e) {
                                    $name  = $e['name'] ?? '—';
                                    $price = isset($e['price']) ? number_format($e['price'], 0, '', ' ') . ' ₽' : '';
                                    $qty   = $e['qty'] ?? 1;
                                    return "• {$name} × {$qty}" . ($price ? " — {$price}" : '');
                                })->implode("\n");
                            })
                            ->visible(fn ($record) => $record && !empty($record->extras)),

                        Forms\Components\Placeholder::make('configuration_display')
                            ->label('Конструктор комплекта')
                            ->columnSpanFull()
                            ->content(function ($record) {
                                if (!$record || empty($record->configuration)) return '—';
                                $cfg = $record->configuration;
                                $lines = [];
                                if (isset($cfg['suction_length'])) {
                                    $lines[] = "Рукав всасывающий: {$cfg['suction_length']} м";
                                }
                                if (isset($cfg['exhaust_length'])) {
                                    $lines[] = "Рукав напорный: {$cfg['exhaust_length']} м";
                                }
                                return implode("\n", $lines) ?: '—';
                            })
                            ->visible(fn ($record) => $record && !empty($record->configuration)),
                    ])
                    ->columns(2)
                    ->deletable(false)
                    ->addable(false)
                    ->reorderable(false),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('number')->label('Номер')->searchable(),
                Tables\Columns\TextColumn::make('created_at')->label('Дата')->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('name')->label('Клиент')->searchable(),
                Tables\Columns\TextColumn::make('phone')->label('Телефон'),
                Tables\Columns\TextColumn::make('total')->label('Сумма')
                    ->formatStateUsing(fn ($state) => number_format($state, 0, '', ' ') . ' ₽'),
                Tables\Columns\TextColumn::make('items_count')->label('Позиций')
                    ->counts('items'),
                Tables\Columns\TextColumn::make('status')->label('Статус')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'new'        => 'warning',
                        'processing' => 'primary',
                        'completed'  => 'success',
                        'cancelled'  => 'danger',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'new'        => 'Новый',
                        'processing' => 'В обработке',
                        'completed'  => 'Завершён',
                        'cancelled'  => 'Отменён',
                        default      => $state,
                    }),
                Tables\Columns\TextColumn::make('delivery_method')->label('Доставка')
                    ->formatStateUsing(fn (string $state) => $state === 'delivery' ? 'Доставка' : 'Самовывоз'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([Actions\ViewAction::make(), Actions\EditAction::make()])
            ->bulkActions([Actions\BulkActionGroup::make([Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view'  => Pages\ViewOrder::route('/{record}'),
            'edit'  => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
