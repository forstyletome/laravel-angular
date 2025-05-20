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

    protected ResponseService $responseService;
    protected AuthService $authService;

    public function __construct(ResponseService $responseService, AuthService $authService)
    {

        $this->responseService = $responseService;
        $this->authService = $authService;

    }

    public function sendResetLinkEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

        }

        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if(!$user){

            return $this->responseService->response(
                false,
                __('auth.user_not_found'),
                404,
                'STANDARD_ERROR'
            );

        }

        if(Cache::has("password_reset_{$user->id}")){

            return $this->responseService->response(
                false,
                __('auth.password_reset_too_soon'),
                429,
                'STANDARD_ERROR'
            );

        }

        $token = Password::createToken($user);

        $user->notify(new CustomResetPassword($token));

        Cache::put("password_reset_{$user->id}", true, now()->addMinutes(1));

        return $this->responseService->response(
            true,
            __('auth.password_reset_sent'),
            200,
            'STANDARD_SUCCESS',
            [
                'type' => 'SUCCESS_ALERT'
            ]
        );

    }

    public function reset(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if($validator->fails()){

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

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

            return $this->responseService->response(
                true,
                __('auth.password_reset_success')
            );

        }

        return $this->responseService->response(
            false,
            __('auth.password_reset_failed'),
            400,
            'STANDARD_ERROR'
        );

    }

}
