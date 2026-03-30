# Техническое задание: Backend для сайта «Бриарей»

## Общее описание

Контентный сайт-каталог производителя противопожарного оборудования ООО «Бриарей».  
**Без онлайн-заказов, без личного кабинета, без корзины.**  
Весь контент управляется через админ-панель Laravel Filament.

---

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Laravel 11, PHP 8.3 |
| Админ-панель | Laravel Filament 3 |
| База данных | MySQL 8 |
| Файловое хранилище | Laravel Storage (локальное / S3 в будущем) |
| Контейнеризация | Docker Compose (Nginx + PHP-FPM + MySQL + Node.js) |

---

## Архитектура

```
briarey/
├── frontend/          ← Next.js (текущий проект)
│   ├── app/
│   ├── components/
│   ├── lib/api.ts     ← HTTP-клиент для запросов к Laravel API
│   └── ...
├── backend/           ← Laravel + Filament
│   ├── app/Models/
│   ├── app/Filament/
│   ├── app/Http/Controllers/Api/
│   ├── routes/api.php
│   ├── database/migrations/
│   └── storage/       ← Загруженные файлы (изображения, PDF)
├── docker-compose.yml
├── docker/
│   ├── nginx/
│   ├── php/
│   └── node/
└── TECHNICAL_SPEC.md
```

**Взаимодействие:** Next.js (SSR) → REST API Laravel → MySQL  
**Админ-панель:** доступна по адресу `backend-url/admin`

---

## Этапы реализации

### Этап 1. Инфраструктура
- [ ] Перенести текущий Next.js проект в папку `frontend/`
- [ ] Создать Laravel-проект в папке `backend/`
- [ ] Настроить Docker Compose (Nginx, PHP-FPM, MySQL, Node.js)
- [ ] Настроить Filament админ-панель
- [ ] Настроить CORS для API
- [ ] Создать `lib/api.ts` на фронте для запросов к backend

### Этап 2. Глобальные настройки сайта
- [ ] Модель `SiteSetting` — контакты, реквизиты, соцсети
- [ ] Подключить Header и Footer к API

### Этап 3. Секции главной страницы
- [ ] Hero-секция
- [ ] Слайдер (4 слайда)
- [ ] Секция «Умный подбор»
- [ ] Преимущества (4 блока)
- [ ] Схема работы (4 шага)
- [ ] Партнёры (логотипы)
- [ ] Производство (3 блока)
- [ ] Калькулятор CTA
- [ ] FAQ

### Этап 4. Новости (CRUD)
- [ ] Модель, миграция, API, админка
- [ ] Список новостей + детальная страница
- [ ] Секция новостей на главной

### Этап 5. Внутренние страницы
- [ ] О компании (видео, колонки, фото-слайдер)
- [ ] Сертификаты (CRUD)
- [ ] Вакансии (CRUD)
- [ ] Дилерам (герой, шаги)
- [ ] Страница сертификатов (герой, описание)
- [ ] Страница вакансий (герой, описание)

### Этап 6. Формы обратной связи
- [ ] Контактная форма → сохранение в БД + email-уведомление
- [ ] Подписка на рассылку
- [ ] Заявка «Стать дилером»

### Этап 7 (последний). Товары и категории
- [ ] Модели Category, Product
- [ ] CRUD в админке
- [ ] API каталога с фильтрацией и пагинацией
- [ ] Подключение фронта каталога к API

---

## База данных — Схема

### Таблица `site_settings` (одна запись — глобальные настройки)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| phone_1 | varchar(30) | Основной телефон: `8 (800) 201-85-88` |
| phone_2 | varchar(30) | Дополнительный: `8 (916) 707-57-77` |
| email | varchar(100) | `info@briarey.ru` |
| work_hours | varchar(100) | `ПН–ПТ — с 8:00 до 17:00` |
| address | text | Адрес производства |
| inn | varchar(20) | `5040108803` |
| ogrn | varchar(20) | `1115040008016` |
| okpo | varchar(20) | `92662134` |
| company_name | varchar(255) | Полное наименование |
| facebook_url | varchar(255) | |
| youtube_url | varchar(255) | |
| instagram_url | varchar(255) | |
| twitter_url | varchar(255) | |
| logo | varchar(255) | Путь к файлу логотипа |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `hero_section` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Системы газодымоудаления` |
| subtitle | varchar(255) | `Производство и продажа` |
| cta_text | varchar(100) | `Каталог` |
| cta_link | varchar(255) | `/catalog` |
| card_title | varchar(255) | `Подбор комплекта за 2 минуты` |
| card_description | text | |
| card_button_text | varchar(100) | `Калькулятор` |
| card_button_link | varchar(255) | `/calculator` |
| background_image | varchar(255) | Путь к изображению |
| product_image | varchar(255) | Путь к gif/изображению продукта |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `slides` (коллекция, ~4 записи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | Порядок отображения |
| image | varchar(255) | Изображение слайда |
| title | varchar(255) | `Ведущее производство` |
| subtitle | text | Подзаголовок (поддержка \n) |
| icon | varchar(50) | Иконка: `gear`, `shield`, `truck`, `snowflake` |
| stat_title | varchar(255) | Статистика — заголовок |
| stat_description | text | Статистика — описание |
| next_feature | text | Текст превью следующего слайда |
| button_text | varchar(100) | Текст кнопки |
| button_link | varchar(255) | Ссылка кнопки |
| is_active | boolean | Активен ли слайд |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `smart_pick_section` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Умный подбор оборудования` |
| description | text | |
| button_text | varchar(100) | `Калькулятор` |
| button_link | varchar(255) | `/calculator` |
| image | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `advantages` (коллекция, ~4 записи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | Порядок |
| icon | varchar(50) | `arrow`, `circle`, `cpu`, `shield` |
| title | varchar(255) | `Быстрая отгрузка 1–3 дня` |
| description | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `advantages_section` (одна запись — заголовки секции)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Преимущества компании` |
| subtitle | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `work_steps` (коллекция, ~4 записи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | Порядок (01, 02...) |
| title | varchar(255) | `Подбор оборудования` |
| description | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `work_steps_section` (одна запись — заголовки секции)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Схема работы` |
| subtitle | varchar(255) | `Реальный производитель` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `partners` (коллекция, ~6 записей)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| name | varchar(255) | Название партнёра |
| logo | varchar(255) | Путь к логотипу |
| url | varchar(255) | Ссылка (опционально) |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `partners_section` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Работаем с клиентами` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `production_features` (коллекция, ~3 записи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| title | varchar(255) | `ISO 9001` |
| description | text | |
| image | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `production_section` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Производство` |
| subtitle | varchar(255) | `Локализация производства 95%` |
| button_text | varchar(100) | `Видео инструкции` |
| button_link | varchar(255) | `/video` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `calculator_cta` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Подбор комплекта за 2 минуты` |
| title_highlight | varchar(100) | `2 минуты` (выделенная часть) |
| description | text | |
| button_text | varchar(100) | `Калькулятор` |
| button_link | varchar(255) | `/calculator` |
| image | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `faqs` (коллекция, ~4+ записей)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| question | text | |
| answer | text | |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `faq_section` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| title | varchar(255) | `Частые вопросы` |
| subtitle | text | |
| button_text | varchar(100) | `Больше информации` |
| button_link | varchar(255) | `/faq` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `news` (коллекция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| slug | varchar(255) UNIQUE | URL-slug |
| title | varchar(255) | Заголовок |
| excerpt | text | Краткое описание для карточки |
| content | longtext | Полный HTML-контент статьи |
| date | date | Дата публикации |
| image | varchar(255) | Основное изображение |
| is_featured | boolean | Отображать как главную новость |
| is_published | boolean | Опубликована ли |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `news_content_blocks` (блоки контента новости)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| news_id | bigint FK → news | |
| sort_order | int | |
| title | varchar(255) | Заголовок блока |
| text | text | Текст блока |
| image | varchar(255) | Изображение (опционально) |
| has_play_icon | boolean | Показывать иконку play поверх изображения |
| is_reversed | boolean | Обратный порядок (изображение слева) |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `certificates` (коллекция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| title | varchar(255) | Название сертификата |
| image | varchar(255) | Превью-изображение |
| file | varchar(255) | PDF-файл для скачивания |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `vacancies` (коллекция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| title | varchar(255) | Должность |
| salary | varchar(100) | `от 70 000 руб.` |
| duties | text | Описание обязанностей |
| image | varchar(255) | |
| link | varchar(255) | Ссылка на вакансию (hh.ru и т.д.) |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `about_page` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| video_url | varchar(255) | Ссылка на видео |
| poster_image | varchar(255) | Обложка видео |
| column_1_title | varchar(255) | Заголовок колонки 1 |
| column_1_text | text | Текст колонки 1 |
| column_2_title | varchar(255) | Заголовок колонки 2 |
| column_2_text | text | Текст колонки 2 |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `about_photos` (коллекция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| image | varchar(255) | Путь к фото |
| alt | varchar(255) | Alt-текст |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `dealers_page` (одна запись)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| hero_title | varchar(255) | `Наша продукция в вашем магазине` |
| hero_description | text | |
| hero_button_text | varchar(100) | `Получить презентацию` |
| hero_image | varchar(255) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `dealer_steps` (коллекция, ~3 записи)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| title | varchar(255) | `Обмен информацией` |
| description | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `certificates_page` (одна запись — заголовки страницы)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| hero_title | varchar(255) | |
| hero_description | text | |
| hero_image | varchar(255) | |
| column_1_title | varchar(255) | |
| column_1_text | text | |
| column_2_title | varchar(255) | |
| column_2_text | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `vacancies_page` (одна запись — заголовки страницы)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| hero_title | varchar(255) | |
| hero_description | text | |
| hero_image | varchar(255) | |
| column_1_title | varchar(255) | |
| column_1_text | text | |
| column_2_title | varchar(255) | |
| column_2_text | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `contact_form_topics` (коллекция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| label | varchar(255) | `Стать дилером`, `Технический вопрос`... |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `contact_submissions` (заявки с формы)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| name | varchar(255) | |
| phone | varchar(30) | |
| email | varchar(255) | |
| message | text | |
| topic | varchar(255) | Выбранная тема |
| is_subscribed | boolean | Подписка на рассылку |
| is_read | boolean | Прочитана ли в админке |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `newsletter_subscribers` (подписки на рассылку)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| email | varchar(255) UNIQUE | |
| created_at | timestamp | |

---

### Таблица `categories` (этап 7 — последний)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| sort_order | int | |
| name | varchar(255) | `Дымососы` |
| slug | varchar(255) UNIQUE | `dymososy` |
| icon | varchar(255) | Иконка категории |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `category_attributes` (шаблон характеристик категории)

У каждой категории свой набор полей. Например, у «Дымососов» — производительность, масса, габариты; у «Дверей» — огнестойкость, размер полотна.

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| category_id | bigint FK → categories | |
| name | varchar(255) | Название поля: `Производительность` |
| key | varchar(100) | Slug: `productivity` (для Excel-колонок) |
| type | enum | `text`, `number`, `select` |
| unit | varchar(50) NULL | Единица: `м³/час`, `кг`, `мм` |
| options | json NULL | Для type=select: `["EI30","EI60","EI90"]` |
| is_required | boolean | Обязательно ли при импорте |
| sort_order | int | Порядок в карточке товара |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `products` (этап 7 — последний)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| category_id | bigint FK → categories | |
| slug | varchar(255) UNIQUE | |
| name | varchar(255) | |
| badge | varchar(255) | Бейдж (`Газо- и дымоудаление после ПТ`) |
| price | int | Цена в рублях |
| image | varchar(255) | Основное изображение |
| calculator_hint | text NULL | Подсказка калькулятора |
| technical_doc_url | varchar(255) NULL | Ссылка на техдокументацию |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_attribute_values` (характеристики товара — EAV)

Значения заполняются из Excel или в админке. Связь через `category_attributes` определяет, какие поля есть у товара.

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| category_attribute_id | bigint FK → category_attributes | |
| value | varchar(255) | `1500 м³/час`, `15 кг`, `EI60` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_images` (галерея товара)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| image | varchar(255) | |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_composition_items` (состав комплекта — строки)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| text | varchar(255) | `+ рукав всасывающий — 5 м` |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_starter_kit_items` (элементы стартового комплекта)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| name | varchar(255) | `Дымосос (основной товар)` |
| description | text | `Производительность: от 1500 м³/час.\nКол-во: 1 шт.` |
| image | varchar(255) | |
| qty | varchar(50) | `1 шт.`, `5 м`, `10 м` |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_main_specs` (блоки описания — аккордионы)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| title | varchar(255) | `Назначение` |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_main_spec_columns` (колонки внутри блока описания)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_main_spec_id | bigint FK → product_main_specs | |
| heading | varchar(255) | `Основное назначение:` |
| content | json | `["Строка 1","Строка 2",...]` |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### Таблица `product_extras` (дополнительное оборудование к товару)

| Поле | Тип | Описание |
|------|-----|----------|
| id | bigint PK | |
| product_id | bigint FK → products | |
| name | varchar(255) | `Стартовый комплект` |
| description | text | |
| price | int | Цена в рублях |
| image | varchar(255) | |
| sort_order | int | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## Импорт товаров из Excel

### Библиотека: `maatwebsite/excel` (Laravel Excel)

### Поток работы:
1. Администратор создаёт категорию + задаёт `category_attributes` (шаблон полей)
2. В админке кнопка **«Скачать шаблон Excel»** — генерирует .xlsx с колонками для выбранной категории
3. Партнёр заполняет Excel (базовые данные + характеристики)
4. В админке кнопка **«Импорт товаров»** — загрузка файла
5. При импорте: валидация → создание `products` + `product_attribute_values` + `product_composition_items`
6. После импорта: в админке добавляются фото, стартовые комплекты, extras, блоки описания

### Структура Excel (пример для категории «Дымососы»):

| Колонка A | Колонка B | Колонка C | Колонка D | Колонка E | Колонка F | Колонка G | Колонка H | Колонка I |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Название** | **Артикул (slug)** | **Цена** | **Бейдж** | **Состав комплекта** | **Габаритный размер** | **Масса** | **Электродвигатель** | **Производительность** |
| Дымосос ДПЭ-7... | dpe-7 | 48500 | Газо- и дымоудаление... | рукав всас. 5м; рукав напорн. 10м | 310×500×470 мм | 15 кг | OBR200M-2K | 1500 м³/час |

- Колонки A–E — **фиксированные** (одинаковые для всех категорий)
- Колонки F+ — **динамические** (генерируются из `category_attributes`)
- Состав комплекта — через `;` — автоматически разбивается в `product_composition_items`

### Валидация при импорте:
- Обязательные поля не пустые
- Slug уникальный
- Цена — число
- При ошибке — отчёт с номерами строк

---

## REST API — Эндпоинты

### Глобальные
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/settings` | Настройки сайта (контакты, реквизиты, соцсети) |

### Главная страница
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/hero` | Hero-секция |
| GET | `/api/slides` | Слайды (отсортированные) |
| GET | `/api/smart-pick` | Секция «Умный подбор» |
| GET | `/api/advantages` | Заголовки секции + список преимуществ |
| GET | `/api/work-steps` | Заголовки секции + шаги |
| GET | `/api/partners` | Заголовки секции + логотипы |
| GET | `/api/production` | Заголовки секции + блоки |
| GET | `/api/calculator-cta` | Секция калькулятора |
| GET | `/api/faq` | Заголовки секции + вопросы-ответы |

### Новости
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/news` | Список новостей (пагинация) |
| GET | `/api/news/featured` | Главная новость для секции на главной |
| GET | `/api/news/{slug}` | Детальная страница новости с блоками |

### Внутренние страницы
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/about` | Данные страницы «О компании» + фото |
| GET | `/api/certificates-page` | Заголовки страницы сертификатов |
| GET | `/api/certificates` | Список сертификатов |
| GET | `/api/vacancies-page` | Заголовки страницы вакансий |
| GET | `/api/vacancies` | Список вакансий |
| GET | `/api/dealers` | Данные страницы «Дилерам» + шаги |

### Формы
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/contact-topics` | Список тем для формы обратной связи |
| POST | `/api/contact` | Отправка заявки |
| POST | `/api/newsletter` | Подписка на рассылку |

### Каталог (этап 7 — последний)
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/categories` | Список категорий с количеством товаров |
| GET | `/api/products` | Список товаров (фильтр по категории, пагинация) |
| GET | `/api/products/{slug}` | Детальная карточка товара (атрибуты, комплект, extras, описания) |
| GET | `/api/categories/{id}/export-template` | Скачать Excel-шаблон для категории |
| POST | `/api/categories/{id}/import` | Импорт товаров из Excel |

---

## Filament — Админ-панель

### Ресурсы (коллекции — CRUD)
| Ресурс | Возможности |
|--------|-------------|
| **SlideResource** | Создание/редактирование слайдов, drag-n-drop сортировка, переключение active |
| **AdvantageResource** | CRUD преимуществ, сортировка |
| **WorkStepResource** | CRUD шагов схемы работы |
| **PartnerResource** | Загрузка логотипов, сортировка, вкл/выкл |
| **ProductionFeatureResource** | CRUD блоков производства |
| **FaqResource** | CRUD вопросов-ответов, сортировка |
| **NewsResource** | CRUD новостей, Rich-text редактор, блоки контента, slug-генерация |
| **CertificateResource** | Загрузка изображений и PDF, сортировка |
| **VacancyResource** | CRUD вакансий |
| **ContactSubmissionResource** | Просмотр заявок (только чтение), отметка «прочитано» |
| **NewsletterSubscriberResource** | Просмотр подписчиков |
| **ContactFormTopicResource** | CRUD тем формы |
| **CategoryResource** | CRUD категорий + управление `category_attributes` (Repeater) |
| **ProductResource** | CRUD товаров, динамическая форма по атрибутам категории, фото-галерея, стартовый комплект (Repeater), extras (Repeater), блоки описания (Repeater), кнопки «Скачать шаблон» / «Импорт из Excel» |

### Страницы настроек (глобалы — одна запись)
| Страница | Что редактирует |
|----------|----------------|
| **SiteSettingsPage** | Контакты, реквизиты, соцсети, логотип |
| **HeroSectionPage** | Hero на главной |
| **SmartPickPage** | Секция «Умный подбор» |
| **CalculatorCtaPage** | CTA калькулятора |
| **AboutPageSettings** | Страница «О компании» (видео, колонки) |
| **DealersPageSettings** | Страница «Дилерам» (герой) |
| **CertificatesPageSettings** | Заголовки страницы сертификатов |
| **VacanciesPageSettings** | Заголовки страницы вакансий |
| **AdvantagesSectionSettings** | Заголовки секции преимуществ |
| **WorkStepsSectionSettings** | Заголовки секции схемы работы |
| **PartnersSectionSettings** | Заголовок секции партнёров |
| **ProductionSectionSettings** | Заголовки секции производства |
| **FaqSectionSettings** | Заголовки секции FAQ |

---

## Docker Compose — Сервисы

| Сервис | Образ | Порт | Описание |
|--------|-------|------|----------|
| **nginx** | nginx:alpine | 80 | Проксирование: `/api/*`, `/admin/*`, `/storage/*` → PHP; остальное → Node.js |
| **php** | php:8.3-fpm | 9000 (внутренний) | Laravel + Filament |
| **mysql** | mysql:8.0 | 3306 | База данных |
| **node** | node:20-alpine | 3000 (внутренний) | Next.js dev/production |

### Volumes
- `mysql_data` — персистентное хранилище БД
- `./backend` → `/var/www/backend` (PHP)
- `./frontend` → `/var/www/frontend` (Node.js)
- `./backend/storage/app/public` → доступ через Nginx по `/storage/`

---

## Удаление из фронтенда

После подключения API — удалить:
- `data/cart.ts` — корзины нет
- `data/products.ts` — подключение к API (этап 7)
- `data/news.ts` — подключение к API
- `data/certificates.ts` — подключение к API
- `data/vacancies.ts` — подключение к API
- `app/cart/page.tsx` — страница корзины (не нужна)
- `app/checkout/page.tsx` — страница оформления (не нужна)
- `components/cart/` — компоненты корзины
- `components/checkout/` — компоненты оформления
- Иконки корзины из Header

---

## Порядок работы

```
Этап 1  →  Инфраструктура (Docker, Laravel, Filament, CORS, API-клиент)
  ↓
Этап 2  →  SiteSettings + Header/Footer подключены к API
  ↓
Этап 3  →  Все секции главной страницы через API
  ↓
Этап 4  →  Новости (CRUD, список, детальная, секция на главной)
  ↓
Этап 5  →  О компании, Сертификаты, Вакансии, Дилерам
  ↓
Этап 6  →  Формы обратной связи (сохранение + email)
  ↓
Этап 7  →  Товары и категории (ПОСЛЕДНИЙ ЭТАП)
```
