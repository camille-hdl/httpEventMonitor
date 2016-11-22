const _ = window._;
const $ = window.jQuery;
const Routing = window.Routing;

const React = require("react");
const ReactDOM = require("react-dom");
const LineChart = require("react-chartjs").Line;

import { Button, ButtonToolbar, Grid, Row, Col,
 Table, OverlayTrigger, Tooltip, Glyphicon, Modal,
 Tabs, Tab, Pagination, FormControl, FormGroup, ControlLabel, Label, Checkbox, Form } from "react-bootstrap";

import { isInSelection, getInitBool } from "./utils.js";

export class EventsLineChart extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        return null;
        let fiches = this.props.fiches;
        let chartData = {
            dataSets: []
        };
        let dataSet = {
            label: "Events",
            data: _.map(fiches, (fiche) => {
                return {
                    x: fiche.dateEvent
                };
            })
        };

        return (<LineChart data={this.props.chartData} options={this.props.chartOptions} width="600" height="250"/>);
    }
}

export class Actions extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        return (<div className="recherche-cotes-actions">actions</div>);
    }
}

export class MyPagination extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        let currentPage = (this.props.infosAjax.offset / this.props.nbPagination) + 1;
        let nbPages = (this.props.infosAjax.total / this.props.nbPagination);
        let size = "medium";
        if (typeof this.props.bSize !== "undefined") {
            size = this.props.bSize;
        }
        return (<Pagination style={{margin: 0}} first last maxButtons={10} bsSize={size} ellipsis items={nbPages} activePage={currentPage} onSelect={(eventKey) => {
            if (eventKey !== currentPage) {
                console.log('page : ' + eventKey);
                this.props.callbacks.changeRequestedPage(eventKey);
            }
        }} />);
    }
}

/**
 * Animation de chargement
 *
 * @class LoadingState
 * @main  LoadingState
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
export class LoadingState extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {};
    }
    render() {
        if (!!this.props.loading) {
            return (<div className="overlay">
                <i className="fa fa-refresh fa-spin"></i>
            </div>);
        }
        return null;
    }
}

/**
 * Choix du nombre de lignes par page
 *
 * @class SelectNombre
 * @main  SelectNombre
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
export class SelectNombre extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        let possibleValues = this.props.possibleValues;
        let curValue = this.props.curValue;
        return (
        <Form inline>
            <FormGroup controlId="nombreSelect">
              <ControlLabel>Afficher</ControlLabel>
              <FormControl componentClass="select" value={curValue} placeholder="Choisir une valeur" onChange={(ev) => {
                this.props.changeCallback(ev.target.value);
              }}>
              {_.map(possibleValues, (v, k) => {
                return (<option key={k} value={v.val}>{v.lib}</option>);
              })}
              </FormControl>
            </FormGroup>
        </Form>
        );
    }
}

/**
 * Affichage du nombre de resus sur la page / total
 *
 * @class TexteResultats
 * @main  TexteResultats
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
export class TexteResultats extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        let debut = Number(this.props.infosAjax.offset) + 1;
        let fin = debut + (this.props.infosAjax.fiches.length || 0) - 1;
        let total = this.props.infosAjax.total;
        return (<div className="recherche-cotes-texte-resultats">
             {"Résultat" + (fin > debut ?"s":"") + " " + debut + " à " + fin + " sur " + total}
        </div>);
    }
}



/**
 * Recherche de cotes (popup) : vue (Composants React)
 *
 * @class RechercheContainer
 * @main  RechercheContainer
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
export class RechercheContainer extends React.Component {
    constructor(...args) {
        super(...args);

        this.to = null;
        this.state = {
            store: {},
            infosAjax: {},
            nbPagination: 10,
            requestedPage: 1,
            listeReload: null,
            searchParams: {
            },
            searchChoices: { // pour les listes de filtres
            },
            loading: false
        };
        this.searchInit = {
            params: _.cloneDeep(this.state.searchParams),
            choices: _.cloneDeep(this.state.searchChoices)
        };

        this.ajaxLock = false; // empecher plusieurs appels ajax paralleles

        /**
         * callbacks pour l'UI (pagination, selection)
         * @property {Object} callbacks
         * @property {Function} callbacks.changeNbPagination
         * @property {Function} callbacks.changeRequestedPage
         * @property {Function} callbacks.addToSelection une fiche ou un array de filtres
         * @property {Function} callbacks.removeFromSelection une fiche ou un array de filtres
         * @property {Function} callbacks.reloadResultats version debouncée de `this.reloadResultats`
         */
        this.callbacks = {
            changeNbPagination: (nb) => {
                if (!!this.ajaxLock) {
                    return false;
                }
                this.setState({
                    nbPagination: nb,
                    requestedPage: 1
                });
                return true;
            },
            changeRequestedPage: (page) => {
                if (!!this.ajaxLock) {
                    return false;
                }
                this.setState({
                    requestedPage: page
                });
                return true;
            },
            reloadResultats: _.debounce(() => {
                return this.reloadResultats();
            }, 250, {
                leading: true,
                trailing: true
            })
        };

        /**
         * callbacks pour changer les parametres de recherche. passes en props aux composants Filtres
         * @property {Object} paramsCallbacks
         * @property {Function} paramsCallbacks.changeSerie
         * @property {Function} paramsCallbacks.changeSousSerie
         * @property {Function} paramsCallbacks.changeSousSousSerie
         * @property {Function} paramsCallbacks.changeArticle
         * @property {Function} paramsCallbacks.changePanier
         * @property {Function} paramsCallbacks.changeCommunicable
         * @property {Function} paramsCallbacks.resetParams reset des filtres
         */
        this.paramsCallbacks = {
            changeListe: (liste, valeur) => {
                let tempSearchParams = {};
                tempSearchParams[liste] = valeur;
                this.setState({
                    searchParams: _.assign(_.cloneDeep(this.state.searchParams), tempSearchParams),
                    requestedPage: 1 // reset la page
                });
            },
            resetParams: () => {
                // definir tous les parametres a null
                // reloader les listes a vide
                this.setState({
                    searchParams: _.cloneDeep(this.searchInit.params),
                    searchChoices: _.cloneDeep(this.searchInit.choices),
                    requestedPage: 1
                });
            }
        };


        this.state.store = this.props.store; // initialiser le store
        this.state.infosAjax = this.props.infosAjax;
    }
    /**
     * Requeter les resultats pagines, en fonction des criteres de recherche
     * Renseigne `state.infosAjax`.
     * NE PAS APPELER DIRECTEMENT DEPUIS L'UI : utiliser `this.callbacks.reloadResultats()` (debouncée)
     * @method reloadResultats
     */
    reloadResultats() {
        if (!!this.ajaxLock) {
            // si plusieurs appels successifs, annuler les appels intermediaires mais toujours refaire un dernier apres
            if(!!this.reloadResultats.lastCall) {
                clearTimeout(this.reloadResultats.lastCall);
            }
            this.reloadResultats.lastCall = setTimeout(() => {
                this.reloadResultats();
            }, 250);
            return false;
        }
        this.ajaxLock = true;
        this.setState({
            loading: true
        });
        // recuperer les parametres
        let limit = this.state.nbPagination;
        let offset = (this.state.requestedPage - 1) * this.state.nbPagination;
        $.get(Routing.generate(this.props.route, {offset: offset, limit: limit}), {params: this.state.searchParams}, (data) => {
            this.ajaxLock = false;
            this.setState({
                infosAjax: data,
                loading: false
            });
        });
        return true;
    }
    /**
     * Recuperer le contenu d'une liste en fonction de l'id de son parent (ex: serie > sous-series)
     * Renseigne `state.searchChoices[liste]`.
     * Route : `cot_fiche_popup_ajax_liste_v2`
     * @method reloadListe
     * @param {String} liste cle de la liste. ex : `serie`
     * @param {Int} id identifiant du parent
     */
    reloadListe(liste, id) {
        if (!!liste) {
            $.get(Routing.generate("cot_fiche_popup_ajax_liste_v2", {liste: liste, idParent: id}), (data) => {
                let tempSearchChoices = {};
                tempSearchChoices[liste] = data;
                this.setState({
                    searchChoices: _.assign(_.cloneDeep(this.state.searchChoices), tempSearchChoices)
                });
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        let reload = false;
        let reloadListes = true;
        if (prevState.nbPagination !== this.state.nbPagination) {
            reload = true;
        }
        if (prevState.requestedPage !== this.state.requestedPage) {
            reload = true;
        }
        // si les searchParams ont change, reload resultats et aussi les listes interdependantes
        if (!_.isEqual(prevState.searchParams, this.state.searchParams)) {
            reload = true;
            // verifier quelle liste il faut reload, si elle a change
            if (prevState.listeReload !== this.state.listeReload || prevState.listeReloadId !== this.state.listeReloadId) {
                // this.reloadListe(this.state.listeReload, this.state.listeReloadId);
            }
        }
        if (!!reload) {
            this.callbacks.reloadResultats();
        }

    }
    componentDidMount() {
        // lancer le timeout d'autorefresh
        let self = this;
        let setTo = function _setTo() {
                    self.to = setTimeout(() => {
                        self.callbacks.reloadResultats();
                        _setTo();
                    }, 10000);
                };
        setTo();
    }
}