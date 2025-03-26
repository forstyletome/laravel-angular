<?php

namespace App\Http\Controllers;

use App\Services\TwoFactorAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorAuthController extends Controller{

    protected TwoFactorAuthService $twoFactorAuthService;

    public function __construct(TwoFactorAuthService $twoFactorAuthService)
    {

        $this->twoFactorAuthService = $twoFactorAuthService;

    }

    public function verify2FA(Request $request): JsonResponse
    {

        return $this->twoFactorAuthService->verify2FA($request);

    }

    public function resend2FACode(Request $request): JsonResponse
    {

        return $this->twoFactorAuthService->resend2FACode($request);

    }

}
