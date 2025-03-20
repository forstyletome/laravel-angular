<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TranslationController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify');

//Route::middleware(['auth:sanctum', 'verified'])->get('/protected-route', [AuthController::class, 'protectedRoute']);

Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'reset']);

Route::post('/verify-2fa', [AuthController::class, 'verify2FA']);
Route::post('/resend-2fa', [AuthController::class, 'resend2FACode']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum']);

Route::get('/check-auth', [AuthController::class, 'checkAuthenticated']);
Route::get('/user', [AuthController::class, 'user'])->middleware(['auth:sanctum']);

Route::get('/translations', [TranslationController::class, 'getAllTranslations']);
