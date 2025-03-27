<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\TwoFactorAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (){

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum']);
    Route::get('/check-auth', [AuthController::class, 'checkAuthenticated']);
    Route::post('/verify-2fa', [TwoFactorAuthController::class, 'verify2FA']);
    Route::post('/resend-2fa', [TwoFactorAuthController::class, 'resend2FACode']);

});

Route::prefix('register')->group(function (){

    Route::post('/', [RegisterController::class, 'register']);
    Route::get('/verify-email', [RegisterController::class, 'verifyEmail'])->name('verification.verify');
    Route::post('/resend-verify-email', [RegisterController::class, 'resendVerifyEmail'])->name('verification.resend');

});

Route::prefix('password')->group(function (){

    Route::post('/forgot', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.reset');
    Route::post('/reset', [PasswordResetController::class, 'reset']);

});

Route::get('/translations', [TranslationController::class, 'getAllTranslations']);

// Route::middleware(['auth:sanctum', 'verified'])->get('/protected-route', [AuthController::class, 'protectedRoute']);
