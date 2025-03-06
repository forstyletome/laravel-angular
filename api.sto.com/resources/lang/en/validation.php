<?php
return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute field must be a valid email address.',
    'attributes' => [
        'email' => 'E-mail',
        'password' => 'Password',
        'token' => 'Token',
        'code'  => 'Authorization code',
        'name'  => 'Name',
        'policy'  => 'Privacy Policy',
        'hash'  => 'Hash',
        'id' => 'ID'
    ],
    'invalid_credential' => 'E-mail or password is incorrect.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'integer' => 'The :attribute field must be an integer.',
    'invalid_2fa_code' => 'Invalid code',
    'accepted' => 'The :attribute must be accepted.',
    'unique' => ':attribute already exists in the system.',
    'email_not_verified' => 'You need to verify your email address. To do this, follow the link that was previously sent to your email.',
    'enum' => 'The selected :attribute is invalid.',
    'exists' => 'The selected :attribute is invalid.',
    'email_already_verified' => 'Your email has already been confirmed',
    'broken_link' => 'Invalid link',
    'success_email' => 'Email successfully confirmed',
    'min' => [
        'string' => 'The :attribute field must be at least :min characters.'
    ],
];
?>
