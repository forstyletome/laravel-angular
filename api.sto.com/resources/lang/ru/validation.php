<?php
return [
    'required' => 'Поле :attribute обязательно для заполнения.',
    'email' => 'Поле :attribute должно быть действительным адресом электронной почты.',
    'attributes' => [
        'email' => 'Электронная почта',
        'password' => 'Пароль',
        'token' => 'Секретный ключ',
        'code'  => 'Код авторизации',
        'name'  => 'Имя',
        'policy'  => 'Политика конфиденциальности',
        'hash'  => 'Хэш',
        'id' => 'ID'
    ],
    'invalid_credential' => 'E-mail или пароль не верны.',
    'confirmed' => 'Поле :attribute не совпадает.',
    'integer' => 'Поле :attribute должно быть целым числом.',
    'invalid_2fa_code' => 'Неверный код',
    'accepted' => 'Поле :attribute должно быть принято.',
    'unique' => ':attribute уже существует в системе.',
    'email_not_verified' => 'Ваш необходимо пройти проверку Вашего E-mail адреса. Для этого перейдите по ссылке, которая ранее была Вам отправлена на Ваш E-mail.',
    'enum' => 'Выбранный :attribute недействителен.',
    'exists' => 'Выбранный :attribute недействителен.',
    'email_already_verified' => 'Ваш E-mail уже подтверждён',
    'broken_link' => 'Недействительная ссылка',
    'success_email' => 'Email успешно подтвержден',
    'min' => [
        'string' => 'Поле :attribute должно содержать минимум :min символов.'
    ],
];
?>
