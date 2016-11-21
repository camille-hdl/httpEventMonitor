<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Event
 *
 * @ORM\Table(name="event")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\EventRepository")
 */
class Event
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="eventDateTime", type="datetime")
     */
    private $eventDateTime;

    /**
     * @var int
     *
     * @ORM\Column(name="eventLevel", type="integer", nullable=true)
     */
    private $eventLevel;

    /**
     * @var string
     *eventOrigin
     * @ORM\Column(name="eventOrigin", type="string", length=255, nullable=true)
     */
    private $eventOrigin;

    /**
     * @var string
     *
     * @ORM\Column(name="eventType", type="string", length=255, nullable=true)
     */
    private $eventType;

    /**
     * @var string
     *
     * @ORM\Column(name="eventDescription", type="text", nullable=true)
     */
    private $eventDescription;

    /**
     * @var array
     *
     * @ORM\Column(name="eventData", type="json_array", nullable=true)
     */
    private $eventData;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set eventDateTime
     *
     * @param \DateTime $eventDateTime
     * @return Event
     */
    public function setEventDateTime($eventDateTime)
    {
        $this->eventDateTime = $eventDateTime;

        return $this;
    }

    /**
     * Get eventDateTime
     *
     * @return \DateTime 
     */
    public function getEventDateTime()
    {
        return $this->eventDateTime;
    }

    /**
     * Set eventLevel
     *
     * @param integer $eventLevel
     * @return Event
     */
    public function setEventLevel($eventLevel)
    {
        $this->eventLevel = $eventLevel;

        return $this;
    }

    /**
     * Get eventLevel
     *
     * @return integer 
     */
    public function getEventLevel()
    {
        return $this->eventLevel;
    }

    /**
     * Set eventType
     *
     * @param string $eventType
     * @return Event
     */
    public function setEventType($eventType)
    {
        $this->eventType = $eventType;

        return $this;
    }

    /**
     * Get eventType
     *
     * @return string 
     */
    public function getEventType()
    {
        return $this->eventType;
    }

    /**
     * Set eventOrigin
     *
     * @param string $eventOrigin
     * @return Event
     */
    public function setEventOrigin($eventOrigin)
    {
        $this->eventOrigin = $eventOrigin;

        return $this;
    }

    /**
     * Get eventOrigin
     *
     * @return string 
     */
    public function getEventOrigin()
    {
        return $this->eventOrigin;
    }

    /**
     * Set eventDescription
     *
     * @param string $eventDescription
     * @return Event
     */
    public function setEventDescription($eventDescription)
    {
        $this->eventDescription = $eventDescription;

        return $this;
    }

    /**
     * Get eventDescription
     *
     * @return string 
     */
    public function getEventDescription()
    {
        return $this->eventDescription;
    }

    /**
     * Set eventData
     *
     * @param array $eventData
     * @return Event
     */
    public function setEventData($eventData)
    {
        $this->eventData = $eventData;

        return $this;
    }

    /**
     * Get eventData
     *
     * @return array 
     */
    public function getEventData()
    {
        return $this->eventData;
    }
}
