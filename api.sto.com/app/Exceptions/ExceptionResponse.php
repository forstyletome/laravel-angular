<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Configuration\Exceptions;

class ExceptionResponse
{

    public static function register(Exceptions $exceptions): void
    {

        $exceptions->respond(function(JsonResponse $response){

            switch($response->getStatusCode()){

                case 419:

                    /*
                    return response()->json([
                        'errors' => [
                            'type'      => 'SYSTEM_ERROR',
                            'messages'  => [
                                __('validation.session_expired')
                            ],
                            'data'      => []
                        ]
                    ], 419);
*/
                break;

            }

        });

    }

}
