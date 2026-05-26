# Birthday Scrapbook

A sweet, warm, personal Laravel birthday website designed as an interactive scrapbook book. The visitor turns pages with Previous/Next controls through a cover, countdown page, Polaroid photo spreads, letter page, one-year timeline, wishes, and final celebration page.

## Requirements

- PHP 8.1.10 or newer
- Composer
- Node.js and npm

This project targets Laravel 10 so it can run on the PHP 8.1.10 build included in your Laragon setup.
If `php` is not available in your terminal, use Laragon's full PHP path:

```bash
C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe artisan serve
```

## Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

Open `http://127.0.0.1:8000`.

For production assets:

```bash
npm run build
```

## Customizing

Edit the seeded content in `database/seeders/DatabaseSeeder.php`, then refresh the database:

```bash
php artisan migrate:fresh --seed
```

The default `.env.example` uses Laragon's local MySQL connection:

```env
DB_CONNECTION=mysql
DB_DATABASE=happybirthday
DB_USERNAME=root
DB_PASSWORD=
```

Create the database first if it does not already exist:

```sql
CREATE DATABASE happybirthday CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The long birthday letter is currently a placeholder for Dila Prahista. Replace the `message` value in `database/seeders/DatabaseSeeder.php`, then run the refresh command above.

Gallery images are loaded from `public/images/DILA` by the seeder. Add or remove photos in that folder, then run `php artisan migrate:fresh --seed` to rebuild the Polaroid pages.

# forsayang
