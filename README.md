# E-Commerce Furniture Store / Интернет-магазин мебели

Современный интернет-магазин мебели с каталогом товаров, фильтрацией, поиском и корзиной покупок. Разработан с использованием React и TypeScript, backend на Supabase.

### Функциональность

- **Каталог товаров** - фильтрация по категориям, цене и поиск по названию
- **Корзина покупок** - добавление/удаление товаров, сохранение в localStorage
- **Авторизация** - регистрация и вход пользователей через Supabase Auth
- **Адаптивный дизайн** - mobile-first подход (от 375px до 1440px)
- **Производительность** - оптимизированные рендеры с MobX

### Технологии

| Технология                    | Назначение                             |
| ----------------------------- | -------------------------------------- |
| **React 19** + **TypeScript** | UI компоненты и типобезопасность       |
| **MobX**                      | Управление состоянием                  |
| **React Router 7**            | Навигация и роутинг                    |
| **Supabase**                  | База данных, аутентификация, real-time |
| **Vite**                      | Сборка и сервер разработки             |
| **SCSS Modules**              | Стилизация компонентов                 |
| **Zod**                       | Валидация данных                       |
| **ESLint** / **Prettier**     | Качество кода                          |

### Структура проекта

```
src/
├── App/              # Компоненты страниц
├── components/       # Переиспользуемые UI компоненты
├── hooks/            # Пользовательские хуки React
├── store/            # MobX сторы
├── shared/           # Утилиты, типы, схемы
├── types/            # TypeScript типы
└── styles/           # Глобальные стили
```

### Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/your-username/e-commerce.git
cd e-commerce

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранного проекта
npm run preview
```

### Демо

Проект доступен по ссылке: [e-commerce-iota-pink-57.vercel.app](https://e-commerce-iota-pink-57.vercel.app)

### Маршруты

| Маршрут                    | Описание                      | Доступ                |
| -------------------------- | ----------------------------- | --------------------- |
| `/products`                | Каталог товаров с фильтрацией | Все пользователи      |
| `/products/:id`            | Детальная страница товара     | Все пользователи      |
| `/categories`              | Список категорий              | Все пользователи      |
| `/categories/:name`        | Товары категории              | Все пользователи      |
| `/login` / `/registration` | Авторизация и регистрация     | Только гости          |
| `/user`                    | Личный кабинет                | Только авторизованные |

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://dplveweggqyfhmkobsmu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbHZld2VnZ3F5Zmhta29ic211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg2MTEsImV4cCI6MjA4OTE0NDYxMX0.NceGJs-LcHJFpUsp3jVBMIPnFgLIB9n0suMcUR-7xUQ
```

### Лицензия

MIT

---
