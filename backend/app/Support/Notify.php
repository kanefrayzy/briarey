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
     *
     * $sourceHost — домен, с которого пришла форма (Host запроса). Если передан,
     * в тему и тело добавляется пометка с доменом (punycode переводится в кириллицу),
     * чтобы различать заявки с разных сайтов на одном сервере.
     *
     * Сбой отправки не пробрасывается — только пишется в лог, чтобы не ломать ответ API.
     */
    public static function toSite(string $subject, string $body, ?string $sourceHost = null): void
    {
        $to = env('MAIL_TO_ADDRESS', 'mail@briarey.ru');

        if ($sourceHost) {
            $domain = self::humanDomain($sourceHost);
            $subject = "[{$domain}] {$subject}";
            $body = "Источник (сайт): {$domain}\n\n" . $body;
        }

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::warning('Notify::toSite failed: ' . $e->getMessage());
        }
    }

    /**
     * Приводит хост к читаемому виду: убирает www и переводит punycode
     * (xn--…) обратно в кириллицу — «узелстыковочный.рф».
     */
    private static function humanDomain(string $host): string
    {
        $host = preg_replace('/^www\./i', '', $host);

        if (function_exists('idn_to_utf8')) {
            $decoded = @idn_to_utf8($host);
            if ($decoded) {
                return $decoded;
            }
        }

        return $host;
    }
}
