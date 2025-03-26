<?php

namespace App\Http\Controllers;

use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;

class TranslationController extends Controller
{

    protected TranslationService $translationService;

    public function __construct(TranslationService $translationService)
    {

        $this->translationService = $translationService;

    }

    public function getAllTranslations(): JsonResponse
    {

        return $this->translationService->getAllTranslations();

    }

}
