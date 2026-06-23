<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class Notify
{
    /**
     * Отправляет простое текстовое письмо на контактный адрес сайта
     * (SiteSetting->email, по умолчанию info@briarey.ru).
     * Сбой отправки не пробрасывается — только пишется в лог,
     * чтобы не ломать ответ API (актуально, пока SMTP не настроен).
     */
    public static function toSite(string $subject, string $body): void
    {
        $to = optional(SiteSetting::first())->email ?: 'info@briarey.ru';

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::warning('Notify::toSite failed: ' . $e->getMessage());
        }
    }
}
