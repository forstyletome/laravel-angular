<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Создание тестового пользователя
        User::create([
            'name' => 'Test User',
            'email' => 'all.forstyletome@gmail.com',
            'password' => Hash::make('*smile*'), // Убедитесь, что пароль зашифрован
        ]);
    }
}
