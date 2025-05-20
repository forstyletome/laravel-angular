<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class RegisterService{

    protected ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {

        $this->responseService = $responseService;

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

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

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

            return $this->responseService->response(true, '');

        }catch(\Exception $e){

            return $this->responseService->response(
                false,
                $e->getMessage(),
                500,
                'SYSTEM ERROR'
            );

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

            return $this->responseService->response(
                false,
                $validator->errors()->messages(),
                422,
                'STANDARD_ERROR'
            );

        }

        if($request->expires < now()->timestamp){

            return $this->responseService->response(
                false,
                __('validation.broken_link'),
                410,
                'STANDARD_ERROR'
            );

        }

        $user = User::findOrFail($request->id);

        if(!hash_equals(sha1($user->getEmailForVerification()), $request->hash)){

            return $this->responseService->response(
                false,
                __('validation.broken_link'),
                403,
                'STANDARD_ERROR'
            );

        }

        if($user->hasVerifiedEmail()){

            return $this->responseService->response(
                false,
                __('validation.email_already_verified'),
                403,
                'STANDARD_ERROR'
            );

        }

        $user->markEmailAsVerified();

        return $this->responseService->response(
            true,
            __('validation.success_email'),
            200,
            'SYSTEM_ERROR',
            [
                'type' => 'SUCCESS_ALERT'
            ]
        );

    }

    public function resendVerifyEmail(Request $request): JsonResponse
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

        $user = User::where('email', $request->email)->first();

        if($user->hasVerifiedEmail()){

            return $this->responseService->response(
                false,
                'Email уже подтверждён.',
                400,
                'STANDARD_ERROR'
            );

        }

        $key = 'email-resend:'.$user->id;

        if(RateLimiter::tooManyAttempts($key, 1)){

            return $this->responseService->response(
                false,
                'Слишком много попыток. Попробуйте через '.RateLimiter::availableIn($key).' секунд.',
                429,
                'STANDARD_ERROR'
            );

        }

        RateLimiter::hit($key, 60);

        $user->sendEmailVerificationNotification();

        return $this->responseService->response(
            true,
            'Ссылка для подтверждения успешно отправлена на Ваш E-mail.'
        );

    }

}
