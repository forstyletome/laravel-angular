<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{

    public function response(
        bool $success,
        string|array $message,
        int $status = 200,
        string $type = 'STANDARD_SUCCESS',
        array $data = []
    ): JsonResponse
    {

        return response()->json([
            'success'   => $success,
            'type'      => $type,
            'messages'  => is_array($message) ? $message : [$message],
            'data'      => $data,
            'status'    => $status
        ], $status);

    }
/*
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
*/
}
