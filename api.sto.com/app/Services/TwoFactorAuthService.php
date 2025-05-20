<?php

namespace App\Services;

use App\Mail\TwoFactorCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class TwoFactorAuthService{

    protected ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {

        $this->responseService = $responseService;

    }

    public function verify2FA(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'code' => 'required|integer|digits:6',
        ]);

        if($validator->fails()){

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

        }

        $email = $request->get('email');
        $code = $request->get('code');

        $cachedCode = Cache::get('2fa_code_'.$email);

        if(!$cachedCode || !Hash::check($code, $cachedCode)){

            return $this->responseService->response(
                false,
                __('auth.invalid_2fa_code'),
                401,
                'STANDARD_ERROR'
            );

        }

        Cache::forget('2fa_code_'.$email);

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->responseService->response(
                false,
                __('auth.user_not_found'),
                404,
                'STANDARD_ERROR'
            );

        }

        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getPermissionNames()->pluck('name')->toArray();

        Auth::login($user);

        return $this->responseService->response(
            true,
            '',
            200,
            'STANDARD_SUCCESS',
            [
                'user'  => $user,
                'roles' => $roles,
                'permissions' => $permissions
            ]
        );

    }

    public function resend2FACode(Request $request): JsonResponse
    {

        $email = $request->get('email');
        $countdown = $request->get('countdown');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if($validator->fails()){

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->responseService->response(
                false,
                __('validation.throttle', ['seconds' => $countdown]),
                429,
                'STANDARD_ERROR'
            );

        }

        $user = User::where($email);

        if(!$user){

            return $this->responseService->response(
                false,
                __('auth.user_not_found'),
                404,
                'STANDARD_ERROR'
            );

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->responseService->response(
            true,
            __('notifications.code_resent')
        );

    }

}
