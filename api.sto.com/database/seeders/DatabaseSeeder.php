<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Запуск сидеров
        $this->call([
            UserSeeder::class,
        ]);
    }
}
