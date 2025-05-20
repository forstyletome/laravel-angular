<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

class TranslationService{

    public function getAllTranslations(): JsonResponse
    {

        $languages = File::directories(resource_path('lang'));
        $translations = [];

        foreach($languages as $languageDir){

            $lang = basename($languageDir);
            $translations[$lang] = [];

            $files = File::files($languageDir);

            foreach($files as $file){

                $fileTranslations = require $file->getRealPath();

                $translations[$lang] = array_merge($translations[$lang], $fileTranslations);

            }

        }

        return response()->json($translations);

    }

}
