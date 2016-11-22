const _ = window._;
const $ = window.jQuery;
const Routing = window.Routing;

const React = require("react");
const ReactDOM = require("react-dom");

import { Button, ButtonToolbar, Grid, Row, Col,
 Table, OverlayTrigger, Tooltip, Glyphicon, Modal,
 Tabs, Tab, Pagination, FormControl, FormGroup, ControlLabel, Label, Checkbox, Form } from "react-bootstrap";

import * as Fi from "./filtres.jsx";

import { EventsLineChart, LoadingState, SelectNombre, TexteResultats, MyPagination, Actions, RechercheContainer } from "./composants.jsx";

import { isInSelection, getInitBool } from "./utils.js";


/**
 * Recherche de cotes (popup) : vue (Composants React)  Extends RechercheContainer (contient tout le code commun de gestion des filtres, listes, etc)
 *
 * @class RechercheCotesContainer
 * @main  RechercheCotesContainer
 * @extends RechercheContainer
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
export class FrontContainer extends RechercheContainer {
    constructor(...args) {
        super(...args);
    }
    render() {
        let colSelection = null;
        let mainColLg = 12;
        
        
        
        let texteResultatsColSize = 4;
        
        return (
            <Grid>
            <Row>
                <Col lg={mainColLg} md={12}>
                    <Row>
                        <Col md={12}>
                            <Filtres searchParams={this.state.searchParams} searchChoices={this.state.searchChoices} callbacks={this.paramsCallbacks} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <MyPagination nbPagination={this.state.nbPagination} infosAjax={this.state.infosAjax} callbacks={this.callbacks} />
                        </Col>
                        <Col md={texteResultatsColSize}>
                            <TexteResultats infosAjax={this.state.infosAjax} />
                        </Col>
                        <Col md={2}>
                            <SelectNombre possibleValues={[{val: 10, lib: "10 cotes"}, {val: 20, lib: "20 cotes"}, {val: 50, lib: "50 cotes"}, {val: 100, lib: "100 cotes"},]} curValue={this.state.nbPagination} changeCallback={this.callbacks.changeNbPagination} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <EventsLineChart
                                store={this.state.store}
                                fiches={this.state.infosAjax.fiches}
                                selection={this.state.selection}
                                callbacks={this.callbacks}
                                loading={this.state.loading}
                             />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Resultats  store={this.state.store}
                                        fiches={this.state.infosAjax.fiches}
                                        selection={this.state.selection}
                                        callbacks={this.callbacks}
                                        loading={this.state.loading}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={1}>
                        </Col>
                        <Col md={5}>
                            <MyPagination nbPagination={this.state.nbPagination} infosAjax={this.state.infosAjax} callbacks={this.callbacks} />
                        </Col>
                        <Col md={6}>
                            <TexteResultats infosAjax={this.state.infosAjax} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Actions store={this.props.store} />
                </Col>
            </Row>
        </Grid>);
    }
}

/**
 * Liste des résultats
 *
 * @class Resultats
 * @main  Resultats
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
class Resultats extends React.Component {
    constructor(...args) {
        super(...args);
        /**
         * @property {Object} state
         * @property {Object} 
         */
        this.state = {
            lastFiche: null,
            lastAction: "add",
            lastK: 0
        };
    }
    render() {
        let fiches = this.props.fiches;

        
        return (<div className="recherche-cotes-resultats box">
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{"Date"}</th>
                            <th>{"Application"}</th>
                            <th>{"Version"}</th>
                            <th>{"Origin"}</th>
                            <th>{"Level"}</th>
                            <th>{"Type"}</th>
                            <th>{"Description"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {(_.map(fiches, (fiche, k) => {
                        
                        return (<tr key={k}>
                                {(() => {
                                    
                                    return (<td>
                                        <Button href={Routing.generate("front_event_show", { id: fiche.id })}><Glyphicon glyph="edit" /></Button>
                                    </td>);
                                })()}
                                <td>
                                    {fiche.dateReceived}
                                </td>
                                <td>
                                    {fiche.application}
                                </td>
                                <td>
                                    {fiche.version}
                                </td>
                                <td>
                                    {fiche.origin}
                                </td>
                                <td>
                                    {fiche.level}
                                </td>
                                <td>
                                    {fiche.type}
                                </td>
                                <td>
                                    {fiche.description}
                                </td>
                            </tr>);
                    }))}
                    </tbody>    
                </Table>
                <LoadingState loading={this.props.loading}/>
        </div>);
    }
}


/**
 * Zone de filtrage. Utilise les classes de filtres dans filtres.jsx
 *
 * @class Filtres
 * @main  Filtres
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
class Filtres extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
    }
    render() {
        return (<div className="recherche-cotes-filtres">
        </div>);
    }
}


