<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class Notify
{
    /**
     * Отправляет простое текстовое письмо на служебный адрес для заявок/заказов.
     * По умолчанию — mail@briarey.ru; можно переопределить через MAIL_TO_ADDRESS в .env.
     * Адрес намеренно отделён от публичного контакта сайта (SiteSetting->email).
     * Сбой отправки не пробрасывается — только пишется в лог, чтобы не ломать ответ API.
     */
    public static function toSite(string $subject, string $body): void
    {
        $to = env('MAIL_TO_ADDRESS', 'mail@briarey.ru');

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::warning('Notify::toSite failed: ' . $e->getMessage());
        }
    }
}
