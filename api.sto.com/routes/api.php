<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TranslationController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('locale');
Route::post('/register', [AuthController::class, 'register'])->middleware('locale');

Route::get('/verify-email', [AuthController::class, 'verifyEmail'])->name('verification.verify')->middleware('locale');

//Route::middleware(['auth:sanctum', 'verified'])->get('/protected-route', [AuthController::class, 'protectedRoute']);

Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.reset')->middleware('locale');
Route::post('/reset-password', [AuthController::class, 'reset'])->middleware('locale');

Route::post('/verify-2fa', [AuthController::class, 'verify2FA'])->middleware('locale');
Route::post('/resend-2fa', [AuthController::class, 'resend2FACode'])->middleware('locale');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('locale');

Route::get('/check-auth', [AuthController::class, 'checkAuthenticated'])->middleware('locale');
Route::get('/user', [AuthController::class, 'user'])->middleware(['auth:sanctum', 'locale']);

Route::get('/translations', [TranslationController::class, 'getAllTranslations']);
