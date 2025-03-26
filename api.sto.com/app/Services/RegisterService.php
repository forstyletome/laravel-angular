<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class RegisterService{

    protected ErrorService $errorService;

    public function __construct(ErrorService $errorService)
    {

        $this->errorService = $errorService;

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

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

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

            return $this->errorService->successResponse('', 201, ['success' => true]);

        }catch(\Exception $e){

            return $this->errorService->errorResponse($e->getMessage(), 500);

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

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        if($request->expires < now()->timestamp){

            return $this->errorService->errorResponse(__('validation.broken_link'), 410);

        }

        $user = User::findOrFail($request->id);

        if(!hash_equals(sha1($user->getEmailForVerification()), $request->hash)){

            return $this->errorService->errorResponse(__('validation.broken_link'), 403);

        }

        if($user->hasVerifiedEmail()){

            return $this->errorService->errorResponse(__('validation.email_already_verified'), 403);

        }

        $user->markEmailAsVerified();

        return $this->errorService->successResponse(__('validation.success_email'), 200, ['success' => true]);

    }

    public function resendVerifyEmail(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){

            return $this->errorService->errorResponse($validator->errors()->messages(), 422);

        }

        $user = User::where('email', $request->email)->first();

        if($user->hasVerifiedEmail()){

            return $this->errorService->errorResponse('Email уже подтверждён.', 400);

        }

        $key = 'email-resend:'.$user->id;

        if(RateLimiter::tooManyAttempts($key, 1)){

            return $this->errorService->errorResponse('Слишком много попыток. Попробуйте через '.RateLimiter::availableIn($key).' секунд.', 429);

        }

        RateLimiter::hit($key, 60);

        $user->sendEmailVerificationNotification();

        return $this->errorService->successResponse('Ссылка для подтверждения успешно отправлена на Ваш E-mail.', 200, ['success' => true]);

    }

}
