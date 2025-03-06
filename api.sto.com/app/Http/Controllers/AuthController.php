<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\CustomResetPassword;
use App\Notifications\VerifyEmail;
use Illuminate\Validation\ValidationException;
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

    public function sendResetLinkEmail(Request $request): JsonResponse
    {

        $request->validate(['email' => 'required|email']);

        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if(!$user){

            throw ValidationException::withMessages([
                'email' => __('passwords.email'),
            ]);

        }

        $token = Password::createToken($user);

        $user->notify(new CustomResetPassword($token));

        return response()->json([
            'status' => true
        ]);

    }

    public function reset(Request $request): JsonResponse
    {

        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function($user, $password){

                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();

            }
        );

        if($status === Password::PASSWORD_RESET){

            $this->logout($request);

            return response()->json([
                'errors' => [],
                'message' => [
                    __($status)
                ],
                'status'  => true
            ], 200);

        }

        $errorKey = $status === Password::INVALID_USER ? 'email' : 'token';

        throw ValidationException::withMessages([
            'errors' => [
                $errorKey => [trans($status)]
            ]
        ]);

    }

    public function login(Request $request): JsonResponse
    {

        $email = $request->get('email');

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if(!Auth::validate($credentials)){

            return response()->json([
                'errors' => [
                    __('validation.invalid_credential')
                ]
            ],
                401
            );

        }

        $user = Auth::getProvider()->retrieveByCredentials($credentials);

        if(!$user->hasVerifiedEmail()){

            return response()->json([
                'errors' => [
                    __('validation.email_not_verified')
                ]
            ],
                403
            );

        }

        $code = random_int(100000, 999999);

        Cache::put('2fa_code_'.$user->getAuthIdentifier(), $code, 600);

        Mail::to($email)->send(new TwoFactorCodeMail($code));

        return response()->json([
            'errors' => [],
            'message' => [
                __('messages.send_code')
            ],
            'data' => [
                'user_id' => $user->getAuthIdentifier()
            ]
        ]);

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

            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);

        }

        try{

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'email_verified_at' => null,
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

            $user->notify(new VerifyEmail());

            return response()->json([
                'errors' => [],
                'success' => true,
                'data' => $user,
            ], 201);

        }catch(\Exception $e){

            return response()->json([
                'success' => false,
                'errors' => $e->getMessage(),
            ], 500);

        }

    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'hash' => 'required|string',
            'expires' => 'required|integer',
        ]);

        if($request->expires < now()->timestamp){

            return response()->json(['message' => __('validation.broken_link')], 410);

        }

        $user = User::findOrFail($request->id);

        if(!hash_equals(sha1($user->getEmailForVerification()), $request->hash)){

            return response()->json(['message' => __('validation.broken_link')], 403);

        }

        if($user->hasVerifiedEmail()){

            return response()->json([
                'message' => __('validation.email_already_verified')
            ], 403);

        }

        $user->markEmailAsVerified();

        return response()->json(['message' => __('validation.success_email')]);

    }

    public function verify2FA(Request $request): JsonResponse
    {

        $request->validate([
            'user_id'   => 'required|integer',
            'code'      => 'required|integer',
        ]);

        $userId = $request->user_id;
        $code = $request->code;

        $cachedCode = Cache::get('2fa_code_'.$userId);

        if(!$cachedCode || $cachedCode != $code){

            return response()->json(['message' => __('validation.invalid_2fa_code')], 401);

        }

        Cache::forget('2fa_code_'.$userId);

        $user = User::find($userId);

        Auth::login($user);

        return response()->json([
            'authenticated' => true,
            'userId' => $userId
        ]);

    }

    public function resend2FACode(Request $request): JsonResponse
    {

        $request->validate([
            'user_id' => 'required|integer',
        ]);

        $user = User::find($request->user_id);

        if(!$user){

            return response()->json(['message' => 'User not found'], 404);

        }

        $code = random_int(100000, 999999);

        Cache::put('2fa_code_'.$user->id, $code, 600);

        Mail::to($user->email)->send(new TwoFactorCodeMail($code));

        return response()->json(['message' => __('messages.MESS_29')]);

    }

    public function logout(Request $request): JsonResponse
    {

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(true);

    }

    public function checkAuthenticated(): JsonResponse
    {

        $status = Auth::check();

        return response()->json([
            'errors' => [
                (!$status ? 'User not authenticated' : null)
            ],
            'data' => [
                'authenticated' => $status,
                'userId' => Auth::id()
            ]
        ]);

    }

    public function user(Request $request): JsonResponse
    {

        return response()->json($request->user());

    }

}
