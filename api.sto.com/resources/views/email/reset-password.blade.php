<!DOCTYPE html>
<html>
<head>
    <title>Сброс пароля</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Сброс пароля</h2>
    <p>Здравствуйте, {{ $user->name }}!</p>
    <p>Вы получили это письмо, потому что запросили сброс пароля.</p>
    <p>Секретный ключ:</p>
    <p><b>{{$token}}</b></p>
    <p>Для сброса пароля нажмите на кнопку ниже:</p>
    <a href="{{ $url }}" class="button">Сбросить пароль</a>
    <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
    <p>С уважением, команда {{ config('app.name') }}.</p>
</div>
</body>
</html>
