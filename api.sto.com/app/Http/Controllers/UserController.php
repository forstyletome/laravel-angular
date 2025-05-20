<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{

    protected UserService $userService;

    public function __construct(UserService $userService)
    {

        $this->userService = $userService;

    }

    public function getUser(): JsonResponse
    {

        return $this->userService->getUser();

    }

}
