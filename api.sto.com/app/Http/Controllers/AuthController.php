<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\CustomResetPassword;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\TwoFactorCodeMail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function login(Request $request): JsonResponse
    {

        $email = $request->get('email');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $key = 'login_attempts_'.$email;

        if(RateLimiter::tooManyAttempts($key, 5)){

            return $this->errorResponse(__('validation.throttle', ['seconds' => RateLimiter::availableIn($key)]), 429, [
                'retry_after' => RateLimiter::availableIn($key)
            ]);

        }

        if(!Auth::validate($request->only('email', 'password'))){

            RateLimiter::hit($key, 60);

            return $this->errorResponse(__('auth.invalid_credential'), 401);

        }

        RateLimiter::clear($key);

        $user = Auth::getLastAttempted();

        if(!$user->hasVerifiedEmail()){

            return $this->errorResponse(__('auth.email_not_verified'), 403, ['showHideResendLink' => true]);

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->successResponse(__('messages.send_code'), 200, [
                'success' => true
            ]);

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->successResponse(__('messages.send_code'), 200, [
            'success' => true
        ]);

    }

    public function verify2FA(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'code' => 'required|integer|digits:6',
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $email = $request->get('email');
        $code = $request->get('code');

        $cachedCode = Cache::get('2fa_code_'.$email);

        if(!$cachedCode || !Hash::check($code, $cachedCode)){

            return $this->errorResponse(__('auth.invalid_2fa_code'), 401);

        }

        Cache::forget('2fa_code_'.$email);

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->errorResponse(__('auth.user_not_found'), 404);

        }

        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getPermissionNames()->pluck('name')->toArray();

        Auth::login($user);

        return $this->successResponse('', 200, [
            'user'  => $user,
            'roles' => $roles,
            'permissions' => $permissions
        ]);

    }

    public function resend2FACode(Request $request): JsonResponse
    {

        $email = $request->get('email');
        $countdown = $request->get('countdown');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->errorResponse(__('validation.throttle', ['seconds' => $countdown]), 429);

        }

        $user = User::where($email);

        if(!$user){

            return $this->errorResponse(__('auth.user_not_found'), 404);

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->successResponse(__('notifications.code_resent'), 200, ['success' => true]);

    }

    public function logout(Request $request): JsonResponse
    {

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $cookie = Cookie::forget('XSRF-TOKEN');

        return $this->successResponse('', 200, ['success' => true])->withCookie($cookie);

    }

    public function sendResetLinkEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->errorResponse(__('auth.user_not_found'), 404);

        }

        if(Cache::has("password_reset_{$user->id}")){

            return $this->errorResponse(__('auth.password_reset_too_soon'), 429);

        }

        $token = Password::createToken($user);

        $user->notify(new CustomResetPassword($token));

        Cache::put("password_reset_{$user->id}", true, now()->addMinutes(1));

        return $this->successResponse(__('auth.password_reset_sent'), 200, ['success' => true]);

    }

    public function reset(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function($user, $password){

                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

            }
        );

        if($status === Password::PASSWORD_RESET){

            $this->logout($request);

            return $this->successResponse(__('auth.password_reset_success'), 200, ['success' => true]);

        }

        return $this->errorResponse(__('auth.password_reset_failed'), 400);

    }

    public function register(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'policy' => 'required|accepted',
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        try{

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password'))
            ]);

            $defaultRole = 'admin';
            $user->assignRole($defaultRole);

            $defaultPermissions = [
                'add crm users',
                'edit crm users',
                'delete crm users',
                'update crm users',
                'view crm users',
            ];

            $user->givePermissionTo($defaultPermissions);

            $user->sendEmailVerificationNotification();

            return $this->successResponse('', 201, ['success' => true]);

        }catch(\Exception $e){

            return $this->errorResponse($e->getMessage(), 500);

        }

    }

    public function verifyEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'hash' => 'required|string',
            'expires' => 'required|integer',
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        if($request->expires < now()->timestamp){

            return $this->errorResponse(__('validation.broken_link'), 410);

        }

        $user = User::findOrFail($request->id);

        if(!hash_equals(sha1($user->getEmailForVerification()), $request->hash)){

            return $this->errorResponse(__('validation.broken_link'), 403);

        }

        if($user->hasVerifiedEmail()){

            return $this->errorResponse(__('validation.email_already_verified'), 403);

        }

        $user->markEmailAsVerified();

        return $this->successResponse(__('validation.success_email'), 200, ['success' => true]);

    }

    public function resendVerifyEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){

            return $this->errorResponse($validator->errors()->messages(), 422);

        }

        $user = User::where('email', $request->email)->first();

        if($user->hasVerifiedEmail()){

            return $this->errorResponse('Email уже подтверждён.', 400);

        }

        $key = 'email-resend:'.$user->id;

        if(RateLimiter::tooManyAttempts($key, 1)){

            return $this->errorResponse('Слишком много попыток. Попробуйте через '.RateLimiter::availableIn($key).' секунд.', 429);

        }

        RateLimiter::hit($key, 60);

        $user->sendEmailVerificationNotification();

        return $this->successResponse('Ссылка для подтверждения успешно отправлена на Ваш E-mail.', 200, ['success' => true]);

    }

    public function user(Request $request): JsonResponse
    {

        return response()->json($request->user());

    }

    public function checkAuthenticated(): JsonResponse
    {

        if(Auth::user()){

            return $this->successResponse('',200, ['success' => true]);

        }

        return $this->errorResponse('', 401, [], 'SYSTEM ERROR');

    }

    private function successResponse(string|array $message, int $status, array $data = [], string $type = 'STANDARD_SUCCESS'): JsonResponse
    {

        return response()->json([
            'success' => [
                'type' => $type,
                'messages' => is_array($message) ? $message : [$message],
                'data' => $data
            ]
        ], $status);

    }

    private function errorResponse(string|array $message, int $status, array $data = [], string $type = 'STANDARD_ERROR'): JsonResponse
    {

        return response()->json([
            'errors' => [
                'type' => $type,
                'messages' => is_array($message) ? $message : [$message],
                'data' => $data
            ]
        ], $status);

    }

}
