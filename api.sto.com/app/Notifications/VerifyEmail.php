<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class VerifyEmail extends Notification
{
    use Queueable, SerializesModels;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->view('email.verify', ['url' => $url])
            ->subject('Подтверждение email')
            ->line('Пожалуйста, подтвердите ваш адрес электронной почты.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    protected function verificationUrl($notifiable): string
    {

        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());
        $expires = now()->addMinutes(60)->timestamp;

        return sprintf(
            'https://crm.sto.com/verify-email?id=%s&hash=%s&expires=%s',
            $id,
            $hash,
            $expires
        );

    }


}
