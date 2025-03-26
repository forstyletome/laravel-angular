<?php

namespace App\Http\Controllers;

use App\Services\PasswordResetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordResetController extends Controller{

    protected PasswordResetService $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {

        $this->passwordResetService = $passwordResetService;

    }

    public function sendResetLinkEmail(Request $request): JsonResponse
    {

        return $this->passwordResetService->sendResetLinkEmail($request);

    }

    public function reset(Request $request): JsonResponse
    {

        return $this->passwordResetService->reset($request);

    }

}
