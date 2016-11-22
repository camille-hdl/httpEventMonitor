const React = require("react");
const ReactDOM = require("react-dom");
const _ = window._;
const $ = window.jQuery;

import * as FrontView from "./front.jsx";


/**
 * Recherche de cotes (dans popup)
 * @module  CotesBundle
 * @submodule CotesBundle_CotesRechercheCotes 
 * @main  CotesBundle_CotesRechercheCotes
 */


/**
 * 
 * 
 * @class  Front
 * @main  Front
 * @constructor
 * @param {Object} params
 * @param {String} params.element ID html du conteneur
 * @param {Object} params.filtres Collection clé -> valeur des listes pour les filtres
 * @param {Object} params.infosAjax Resultats de la 1ere recherche (vide)
 */
class Front {
    constructor(params) {
        /**
         * @property {String} elemID
         */
        this.elemID = params.element;

        /**
         * @property {Object} filtres
         */
        this.filtres = params.filtres;


        /**
         * @property {String} route Route pour rechercher/recuperer les resultats
         */
        this.route = "front_event_search";


        /**
         * @property {Object} store
         * @deprecated
         */
        this.store = {
            selection: {},
            infosAjax: {}
        };

        /**
         * @property {Object} container Reference vers l'instance React
         */
        this.container;


        /**
         * @property {Object} infosAjax pour initialiser la vue avec le resultat de la recherche initiale
         * @type {[type]}
         */
        this.infosAjax = params.infosAjax;

        this.render();
    }
    /**
     * Render : appelle la vue React
     * @method  render
     */
    render() {
        this.container = React.createElement(FrontView.FrontContainer, {
            store: this.store,
            infosAjax: this.infosAjax,
            filtres: this.filtres,
            route: this.route,
        });
        ReactDOM.render(
            this.container,
            document.getElementById(this.elemID)
        );
    }
}

module.exports = Front;