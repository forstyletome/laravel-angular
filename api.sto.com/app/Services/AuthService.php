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

    protected ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {

        $this->responseService = $responseService;

    }

    public function login(Request $request): JsonResponse
    {

        $email = $request->get('email');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){

            return $this->responseService->response(false, $validator->errors()->messages(), 422, 'STANDARD_ERROR');

        }

        $key = 'login_attempts_'.$email;

        if(RateLimiter::tooManyAttempts($key, 5)){

            return $this->responseService->response(
                false,
                __('validation.throttle', ['seconds' => RateLimiter::availableIn($key)]),
                429,
                'STANDARD_ERROR',
                [
                    'retry_after' => RateLimiter::availableIn($key)
                ]
            );

        }

        if(!Auth::validate($request->only('email', 'password'))){

            RateLimiter::hit($key);

            return $this->responseService->response(
                false,
                __('auth.invalid_credential'),
                401,
                'STANDARD_ERROR'
            );

        }

        RateLimiter::clear($key);

        $user = Auth::getLastAttempted();

        if(!$user->hasVerifiedEmail()){

            return $this->responseService->response(
                false,
                __('auth.email_not_verified'),
                403,
                'STANDARD_ERROR',
                [
                    'showHideResendLink' => true
                ]
            );

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->responseService->response(
                false,
                __('messages.send_code'),
                200,
                'STANDARD_ERROR'
            );

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->responseService->response(
            true,
            __('messages.send_code')
        );

    }

    public function logout(Request $request): JsonResponse
    {

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->responseService->response(
            true,
            '',
            200,
            'STANDARD_SUCCESS',
            ['success' => true]
        )->withCookie(Cookie::forget('XSRF-TOKEN'));

    }

    public function checkAuthenticated(Request $request): JsonResponse
    {

        $clientPath = $request->header('X-Client-Path', '/');

        error_log($clientPath);

        $showHideSystemErrorPath = [
            '/',
            '/login',
            '/register',
            '/forgot-password',
            '/verify-email',
            '/resend-verify-email'
        ];

        $data = [];

        if(Auth::user()){

            return $this->responseService->response(
                true,
                ''
            );

        }

        if(in_array($clientPath, $showHideSystemErrorPath)){

            $data = [
                'HIDE_SYSTEM_ERROR' => true
            ];

        }

        //return $this->errorService->successResponse('',401, ['success' => false]);

        return $this->responseService->response(
            false,
            '',
            401,
            'SYSTEM_ERROR',
            $data
        );

    }

}
