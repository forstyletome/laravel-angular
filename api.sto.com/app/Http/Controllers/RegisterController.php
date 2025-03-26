<?php

namespace App\Http\Controllers;

use App\Services\RegisterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegisterController extends Controller{

    protected RegisterService $registerService;

    public function __construct(RegisterService $registerService)
    {

        $this->registerService = $registerService;

    }

    public function register(Request $request): JsonResponse
    {

        return $this->registerService->register($request);

    }

    public function verifyEmail(Request $request): JsonResponse
    {

        return $this->registerService->verifyEmail($request);

    }

    public function resendVerifyEmail(Request $request): JsonResponse
    {

        return $this->registerService->resendVerifyEmail($request);

    }

}
