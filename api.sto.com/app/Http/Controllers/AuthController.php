<?php
namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {

        $this->authService = $authService;

    }

    public function login(Request $request): JsonResponse
    {

        return $this->authService->login($request);

    }

    public function logout(Request $request): JsonResponse
    {

        return $this->authService->logout($request);

    }

    public function checkAuthenticated(Request $request): JsonResponse
    {

        return $this->authService->checkAuthenticated($request);

    }

}
