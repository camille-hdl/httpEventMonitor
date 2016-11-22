<?php
namespace AppBundle\EventListener;

use Doctrine\DBAL\Event\ConnectionEventArgs;

class MysqlListener
{
    public function postConnect(ConnectionEventArgs $args)
    {
        // POUR FIX LE PROBLEME SUR MYSQL 5.7
        // Ajouter un mode : SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));
        // Supprimer un mode : SET sql_mode=(SELECT CONCAT(@@sql_mode,',ONLY_FULL_GROUP_BY'));

        // decommenter pour fix les problemes sur mysql 5.7 en attendant la maj de doctrine
        // https://github.com/doctrine/doctrine2/issues/5622
        $args->getConnection()->executeQuery("SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));");
    }
}
