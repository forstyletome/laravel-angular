<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ErrorService
{

    public function successResponse(string|array $message, int $status, array $data = [], string $type = 'STANDARD_SUCCESS'): JsonResponse
    {

        return response()->json([
            'success' => [
                'type' => $type,
                'messages' => is_array($message) ? $message : [$message],
                'data' => $data
            ]
        ], $status);

    }

    public function errorResponse(string|array $message, int $status, array $data = [], string $type = 'STANDARD_ERROR'): JsonResponse
    {

        return response()->json([
            'errors' => [
                'type' => $type,
                'messages' => is_array($message) ? $message : [$message],
                'data' => $data
            ]
        ], $status);

    }

}
