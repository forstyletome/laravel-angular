<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\CustomResetPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class PasswordResetService{

    protected ErrorService $errorService;
    protected AuthService $authService;

    public function __construct(ErrorService $errorService, AuthService $authService)
    {

        $this->errorService = $errorService;
        $this->authService = $authService;

    }

    public function sendResetLinkEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->errorService->errorResponse(__('auth.user_not_found'), 404);

        }

        if(Cache::has("password_reset_{$user->id}")){

            return $this->errorService->errorResponse(__('auth.password_reset_too_soon'), 429);

        }

        $token = Password::createToken($user);

        $user->notify(new CustomResetPassword($token));

        Cache::put("password_reset_{$user->id}", true, now()->addMinutes(1));

        return $this->errorService->successResponse(__('auth.password_reset_sent'), 200, ['success' => true]);

    }

    public function reset(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if($validator->fails()){

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

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

            $this->authService->logout($request);

            return $this->errorService->successResponse(__('auth.password_reset_success'), 200, ['success' => true]);

        }

        return $this->errorService->errorResponse(__('auth.password_reset_failed'), 400);

    }

}
