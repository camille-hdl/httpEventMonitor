<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Event;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 * Event controller.
 *
 * @Route("front/event")
 */
class EventController extends Controller
{
    /**
     * Lists all event entities.
     *
     * @Route("/", name="front_event_index")
     * @Template("AppBundle:event:index.html.twig")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        // premiers resultats
        $resultats = $this->frontRecherche(0, 10, false);

        return array(
            "filtres" => array(
            ),
            "resultats" => $resultats
        );
    }

    /**
     * Lists all event entities.
     *
     * @Route("/event/search", name="front_event_search", options={"expose"=true})
     * @Method("GET")
     */
    public function frontRecherche($offset = 0, $limit = 10, $json = true)
    {
        
        $em = $this->getDoctrine()->getManager();
        $params = $this->getRequest()->get('params');
        $eventsPaginator = $em->getRepository('AppBundle:Event')->rechercheFront($params, $offset, $limit);
   
        $fiches = array();
        if ($eventsPaginator->count() > 0) {
            foreach ($eventsPaginator as $event) :
                $fiches[] = $event->rechercheFrontSerialize();
            endforeach;
        }
        $sortieData = array(
            "success" => true,
            "fiches" => $fiches,
            "total" => $eventsPaginator->count(),
            "offset" => $offset
        );
        
        if ($json) {
            $sortie = new JsonResponse();
            $sortie->setData($sortieData);

            return $sortie;
        }
        return $sortieData;
    }

    /**
     * Finds and displays a event entity.
     *
     * @Route("/{id}", name="front_event_show", options={"expose"=true})
     * @Template("AppBundle:event:show.html.twig")
     * @Method("GET")
     */
    public function showAction(Event $event)
    {

        return array(
            'event' => $event,
        );
    }
}
