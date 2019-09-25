<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber 
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        $user = $event->getUser();

        $data = $event->getData();
        $data['firstName'] = $user->getFistName();
        $data['lasttName'] = $user->getLastName();

        $event->setData($data);
        $event->getData();
    }
}