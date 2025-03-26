<?php
namespace App\Services;

use App\Mail\TwoFactorCodeMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class AuthService
{

    protected ErrorService $errorService;

    public function __construct(ErrorService $errorService)
    {

        $this->errorService = $errorService;

    }

    public function login(Request $request): JsonResponse
    {

        $email = $request->get('email');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        $key = 'login_attempts_'.$email;

        if(RateLimiter::tooManyAttempts($key, 5)){

            return $this->errorService->errorResponse(__('validation.throttle', ['seconds' => RateLimiter::availableIn($key)]), 429, [
                'retry_after' => RateLimiter::availableIn($key)
            ]);

        }

        if(!Auth::validate($request->only('email', 'password'))){

            RateLimiter::hit($key, 60);

            return $this->errorService->errorResponse(__('auth.invalid_credential'), 401);

        }

        RateLimiter::clear($key);

        $user = Auth::getLastAttempted();

        if(!$user->hasVerifiedEmail()){

            return $this->errorService->errorResponse(__('auth.email_not_verified'), 403, ['showHideResendLink' => true]);

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->errorService->successResponse(__('messages.send_code'), 200, [
                'success' => true
            ]);

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->errorService->successResponse(__('messages.send_code'), 200, [
            'success' => true
        ]);

    }

    public function logout(Request $request): JsonResponse
    {

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->errorService->successResponse('', 200, ['success' => true])->withCookie(Cookie::forget('XSRF-TOKEN'));

    }

    public function checkAuthenticated(): JsonResponse
    {

        if(Auth::user()){

            return $this->errorService->successResponse('',200, ['success' => true]);

        }

        return $this->errorService->errorResponse('', 401, [], 'SYSTEM ERROR');

    }

}
