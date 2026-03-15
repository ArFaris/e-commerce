# E-Commerce Furniture Store

Интернет-магазин мебели с каталогом товаров, фильтрацией, поиском и корзиной.

## Технологии

**Frontend:** React, TypeScript, MobX, React Router, Vite, SCSS Modules  
**Backend:** Supabase (PostgreSQL, Auth, Realtime)  
**Валидация:** Zod  
**Инструменты:** ESLint, Prettier, Git

## Функциональность

- Каталог с фильтрацией
- Поиск товаров по названию
- Корзина с сохранением в localStorage
- Авторизация и регистрация пользователей
- Личный кабинет с редактированием профиля
- Адаптивная верстка (375px → 1440px)

## Роутинг

| Маршрут                    | Описание         |
| -------------------------- | ---------------- |
| `/products`                | Каталог товаров  |
| `/products/:id`            | Карточка товара  |
| `/categories`              | Категории        |
| `/categories/:name`        | Товары категории |
| `/login` / `/registration` | Авторизация      |
| `/user`                    | Профиль          |

## Запуск проекта

```bash
npm install
npm run dev
```
