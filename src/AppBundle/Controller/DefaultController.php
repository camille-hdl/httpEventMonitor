<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use AppBundle\Entity\Event;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/index.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ));
    }

    /**
     * @Route("/event", name="add_event")
     * @Method("POST")
     */
    public function addEventAction(Request $request)
    {
        // echo(json_encode(array(
        //     "origin" => "test",
        //     "application" => "Arkotheque",
        //     "version" => "0.1",
        //     "level" => 2,
        //     "type" => "testType",
        //     "date" => date(time()),
        //     "description" => "un event de test"
        // )));
        // die();
        // Verifier que l'appel vient des hosts autorisés (ou gérer dans le security)
        // Enregistrer l'event
        $em = $this->getDoctrine()->getManager();
        $event = new Event();
        $event->setEventReceivedDate(new \DateTime(date("Y-m-d H:i:s", time())));
        if ($request->get("data")) {
            $eventData = json_decode($request->get("data"), true);
            if (isset($eventData["origin"])) {
                $event->setEventOrigin($eventData["origin"]);
            }
            if (isset($eventData["application"])) {
                $event->setEventApplication($eventData["application"]);
            }
            if (isset($eventData["version"])) {
                $event->setEventApplicationVersion($eventData["version"]);
            }
            if (isset($eventData["level"])) {
                $event->setEventLevel((int)$eventData["level"]);
            }
            if (isset($eventData["type"])) {
                $event->setEventType($eventData["type"]);
            }
            if (isset($eventData["date"])) {
                $event->setEventDateTime(new \DateTime(date('Y-m-d H:i:s', $eventData["date"])));
            }
            if (isset($eventData["description"])) {
                $event->setEventDescription($eventData["description"]);
            }
            $em->persist($event);
            $em->flush();
        }
        $output = new JsonResponse();
        $output->setData(array(
            "success" => true
        ));
        return $output;
    }
}
