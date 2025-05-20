<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 24px;
            color: #333;
        }
        .content {
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Подтверждение вашего адреса электронной почты</h1>
    </div>
    <div class="content">
        <p>Здравствуйте!</p>
        <p>Пожалуйста, подтвердите ваш адрес электронной почты, нажав на кнопку ниже:</p>
        <a href="{{ $url }}" class="button">Подтвердить email</a>
        <p>Если вы не создавали аккаунт, просто проигнорируйте это письмо.</p>
    </div>
    <div class="footer">
        <p>Спасибо за использование нашего сервиса!</p>
    </div>
</div>
</body>
</html>
