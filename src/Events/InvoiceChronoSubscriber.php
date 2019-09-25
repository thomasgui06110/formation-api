<?php

namespace App\Events;

use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event)
    {
        
        //dd($this->repository->findNextChrono($this->security->getUser()));
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if($invoice instanceof Invoice && $method === "POST")
        {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            //dd($nextChrono);
            $invoice->setChrono($nextChrono);

            // A déplacer dans une class

            if(empty($invoice->getSentAt()))
            {
                $invoice->setSentAt(new \DateTime());
            }
            
        }
    }
}
