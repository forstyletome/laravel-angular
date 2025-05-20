<?php
namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserService
{

    protected ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {

        $this->responseService = $responseService;

    }

    public function getUser(): JsonResponse
    {

        $user = Auth::user();

        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getPermissionNames()->pluck('name')->toArray();

        return $this->responseService->response(
            true,
            '',
            200,
            'STANDARD_SUCCESS',
            [
                'user' => $user,
                'roles' => $roles,
                'permissions' => $permissions
            ]
        );

    }

}
