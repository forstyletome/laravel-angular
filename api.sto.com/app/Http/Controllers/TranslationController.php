<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use function Psy\debug;

class TranslationController extends Controller
{

    public function getAllTranslations(): JsonResponse
    {

        $languages = File::directories(resource_path('lang'));
        $translations = [];

        foreach($languages as $languageDir){

            $lang = basename($languageDir);
            $translations[$lang] = [];

            $files = File::files($languageDir);

            foreach ($files as $file) {

                $fileTranslations = require $file->getRealPath();

                $translations[$lang] = array_merge($translations[$lang], $fileTranslations);

            }
        }

        Log::debug(print_r($translations, true));

        return response()->json($translations);

    }

}
