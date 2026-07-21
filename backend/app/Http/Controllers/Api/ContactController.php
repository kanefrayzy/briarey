<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactFormTopic;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use App\Support\Notify;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function topics()
    {
        return response()->json(
            ContactFormTopic::where('is_active', true)->orderBy('sort_order')->get()
        );
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'company' => 'nullable|string|max:255',
            'inn' => 'nullable|string|max:20',
            'message' => 'nullable|string|max:5000',
            'topic' => 'nullable|string|max:255',
            'is_subscribed' => 'boolean',
        ]);

        $submission = ContactSubmission::create($validated);

        $body = "Новая заявка с сайта\n\n"
            . "Имя: {$submission->name}\n"
            . "Телефон: {$submission->phone}\n"
            . 'Email: ' . ($submission->email ?: '—') . "\n"
            . 'Организация: ' . ($submission->company ?: '—') . "\n"
            . 'ИНН: ' . ($submission->inn ?: '—') . "\n"
            . 'Тема: ' . ($submission->topic ?: '—') . "\n\n"
            . 'Сообщение:' . "\n" . ($submission->message ?: '—');

        Notify::toSite('Новая заявка: ' . ($submission->topic ?: 'без темы'), $body, $request->getHost());

        return response()->json(['success' => true], 201);
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscriber::firstOrCreate($validated);

        return response()->json(['success' => true], 201);
    }
}
