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

    protected ErrorService $errorService;

    public function __construct(ErrorService $errorService)
    {

        $this->errorService = $errorService;

    }

    public function verify2FA(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'code' => 'required|integer|digits:6',
        ]);

        if($validator->fails()){

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        $email = $request->get('email');
        $code = $request->get('code');

        $cachedCode = Cache::get('2fa_code_'.$email);

        if(!$cachedCode || !Hash::check($code, $cachedCode)){

            return $this->errorService->errorResponse(__('auth.invalid_2fa_code'), 401);

        }

        Cache::forget('2fa_code_'.$email);

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->errorService->errorResponse(__('auth.user_not_found'), 404);

        }

        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getPermissionNames()->pluck('name')->toArray();

        Auth::login($user);

        return $this->errorService->successResponse('', 200, [
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

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        $cacheKey = '2fa_code_'.$email;

        if(Cache::has($cacheKey)){

            return $this->errorService->errorResponse(__('validation.throttle', ['seconds' => $countdown]), 429);

        }

        $user = User::where($email);

        if(!$user){

            return $this->errorService->errorResponse(__('auth.user_not_found'), 404);

        }

        $code = random_int(100000, 999999);

        Cache::put($cacheKey, Hash::make($code), 60);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return $this->errorService->successResponse(__('notifications.code_resent'), 200, ['success' => true]);

    }

}
