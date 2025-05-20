<?php
return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute field must be a valid email address.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'integer' => 'The :attribute field must be an integer.',
    'accepted' => 'The :attribute must be accepted.',
    'unique' => ':attribute already exists in the system.',
    'enum' => 'The selected :attribute is invalid.',
    'exists' => 'The selected :attribute is invalid.',
    'min' => [
        'string' => 'The :attribute field must be at least :min characters.'
    ],
    'digits' => 'The :attribute must be :digits digits.',
    'max' => [
        'numeric' => 'The :attribute may not be greater than :max.',
        'file' => 'The :attribute may not be greater than :max kilobytes.',
        'string' => 'The :attribute may not be greater than :max characters.',
        'array' => 'The :attribute may not have more than :max items.',
    ],
    'throttle' => 'Too many attempts. Please try again in :seconds seconds.',
    'attributes' => [
        'email' => 'E-mail',
        'password' => 'Password',
        'token' => 'Token',
        'code' => 'Authorization code',
        'name' => 'Name',
        'policy' => 'Privacy Policy',
        'hash' => 'Hash',
        'id' => 'ID'
    ],
    'broken_link' => 'Invalid link',
    'success_email' => 'Congratulations! You have successfully confirmed your email address. Please log in using your email and password.'
];
?>
