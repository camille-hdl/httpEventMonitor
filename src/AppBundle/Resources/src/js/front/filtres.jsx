const _ = window._;
const $ = window.jQuery;
const Routing = window.Routing;

const React = require("react");
const ReactDOM = require("react-dom");

import { Button, ButtonToolbar, Grid, Row, Col,
 Table, OverlayTrigger, Tooltip, Glyphicon, Modal,
 Tabs, Tab, Pagination, FormControl, FormGroup, ControlLabel, Label, Checkbox, Form, ListGroup, ListGroupItem } from "react-bootstrap";

let autoCSearch = (haystack, needle) => {
    var pattern = haystack;
    pattern = pattern.replace(/[aàâ]/gi,'[aàâ]');
    pattern = pattern.replace(/[eèéê]/gi,'[eèéê]');
    pattern = pattern.replace(/[oô]/gi,'[oô]');
    pattern = pattern.replace(/[iîï]/gi,'[iîï]');
    pattern = pattern.replace(/[cç]/gi,'[cç]');
    var re = new RegExp("("+pattern+")","gi"); 
    // if(self.options.truncate == "commence_par") {
    //     re = new RegExp("^("+pattern+")","gi"); 
    // }
    return re.test(needle);
}

/**
 * Modèle de filtre pour les listes simples / booleens
 *
 * @class ListeSimple
 * @main  ListeSimple
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
class ListeSimple extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {

        };
        this.callbacks = this.props.callbacks;
    }
    render() {
        return (
            <Form>
                <FormGroup>
                    <FormControl readOnly={(_.size(this.props.searchChoices[this.props.liste]) <= 0)} componentClass="select" value={(this.props.searchParams[this.props.liste] ? Number(this.props.searchParams[this.props.liste]) : "")} placeholder={this.props.label} onChange={(ev) => {
                        this.callbacks.changeListe(this.props.liste, ev.target.value);
                    }}>
                    <option key={"novalue"}>{this.props.label}</option>
                    {_.map(this.props.searchChoices[this.props.liste], (choice, k) => {
                        return (<option value={Number(choice.id)} key={k}>{choice.lib}</option>);
                    })}
                    </FormControl>
                </FormGroup>
            </Form>
        );
    }
}

/**
 * Modèle de filtre pour les autocomplete (magasin par ex)
 *
 * @class Autocomplete
 * @main  Autocomplete
 * @submodule CotesBundle_CotesRechercheCotes_Vue
 * @constructor
 */
class Autocomplete extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            resus: [],
            value: this.props.value || "",
            listVisible: false
        };
        this.hideTo = false;
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
        
    }
    setValue(val) {
        this.setState({
            value: val.libelle
        });
        this.searchResus(val.libelle);
    }
    getValue() {
        return this.state.value;
    }
    selectItem(val) {
        if (typeof this.props.onSelect === "function") {
            this.props.onSelect(val);
        }
    }
    searchResus(str) {
        let source = this.props.source;
        if (typeof source === "function") {
            this.setState({
                resus: source(str)
            });
        } else {
            $.ajax({
                data: {q: str},
                url: source,
                method: 'GET',
                dataType: 'JSON',
                success: (data, textStatus, jqXHR) => {
                    this.setState({
                        resus: data
                    });
                },
                error: (...args) => {
                    console.log('error', args);
                }
            });
        }
    }
    render() {
        // source == function ou string (url)
        const listStyle = {
            display: "block",
            position: "absolute",
            maxHeight: 400,
            zIndex: 999
        };
        if (!!this.props.disabled) {
            listStyle.display = "none";
        }
        if(!this.state.listVisible) {
            listStyle.display = "none";
        }
        let highlight = !!this.props.highlight;
        let list = (<ListGroup style={listStyle} className="autocomplete-list">
            {_.map(this.state.resus, (v, k) => {
                return (
                    <ListGroupItem active={(k==0 && highlight)} key={k} data-value={v.value} onClick={(ev) => {
                        this.selectItem(v);
                        this.setState({
                            value: (!!v.filrouge ? v.filrouge + " > " : "") + v.libelle
                        });
                    }}>{ !!v.filrouge ? v.filrouge + " > " : "" }{ v.libelle }</ListGroupItem>
                );
            })}
        </ListGroup>);
        return (
            <Form>
                <Row>
                    <FormGroup>
                        <Col xs={12}>
                            <FormControl type="text"
                                bsStyle={this.props.bsStyle}
                                value={this.state.value}
                                disabled={this.props.disabled}
                                placeholder={this.props.placeholder}
                                onFocus={() => {
                                    if(this.hideTo !== false) {
                                        clearTimeout(this.this.hideTo);
                                    }
                                    this.setState({listVisible: true});
                                }}
                                onBlur={() => {
                                    this.hideTo = setTimeout(() => {
                                        this.setState({listVisible: false});
                                        this.hideTo = false;
                                    }, 200);
                                }}
                                ref="inputAutocomplete"
                                onChange={(ev) => {
                                    this.selectItem(null); // vider la selection
                                    this.setState({
                                        value: ReactDOM.findDOMNode(this.refs.inputAutocomplete).value
                                    });
                                    this.searchResus(ReactDOM.findDOMNode(this.refs.inputAutocomplete).value);
                                    if (typeof this.props.onChange === "function") {
                                        this.props.onChange(ev);
                                    }
                                }}
                                onKeyUp={this.props.onKeyUp}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col xs={12}>
                        {list}
                        </Col>
                    </FormGroup>
                </Row>
            </Form>
        );
    }
}
