
export function isInSelection (selection, fiche) {
    if (typeof selection[fiche.id] !== "undefined") {
        return true;
    }
    return false;
}

export function getInitBool() {
    return [
            {
                id: 1,
                lib: "Oui"
            },
            {
                id: 0,
                lib: "Non"
            }
        ];
}

// reutilise dans les 2 containers (cote et contenant)
export function getDefaultContainerState(props) {
    return {
        store: {},
        ajoutPanierEnCours: false,
        mode: props.mode,
        infosAjax: {},
        selection: {},
        nbPagination: 10,
        requestedPage: 1,
        listeReload: null,
        selectionVisible: false,
        searchParams: {
            serie: null,
            sousSerie: null,
            sousSousSerie: null,
            article: null,
            communicable: null,
            sortFinal: null,
            magasin: null,
            magasinLft: null,
            magasinRgt: null,
            magasinRoot: null,
            niveauCom: null,
            intitule: ""
        },
        searchChoices: { // pour les listes de filtres
            serie: props.filtres.series,
            sousSerie: [],
            sousSousSerie: [],
            sortFinal: props.filtres.sortsFinaux,
            communicable: getInitBool(),
            indexable: getInitBool(),
            existeNumerise: getInitBool(),
            panier: props.filtres.paniers,
            DUA: props.filtres.DUAs,
            dureeIncom: props.filtres.dureesIncoms,
            niveauCom: props.filtres.niveauxComs,
            magasin: []
        },
        loading: false
    };
}

export function getDefaultContainerCallbacks(self) {
    return {
        changeNbPagination: (nb) => {
            if (!!self.ajaxLock) {
                return false;
            }
            self.setState({
                nbPagination: nb,
                requestedPage: 1
            });
            return true;
        },
        changeRequestedPage: (page) => {
            if (!!self.ajaxLock) {
                return false;
            }
            self.setState({
                requestedPage: page
            });
            return true;
        },
        addToSelection: (fiche) => {
            let tempSource = {};
            if (typeof fiche.length !== "undefined") {
                // array
                _.each(fiche, (f) => {
                    tempSource[f.id] = f;
                });
            } else {
                tempSource[fiche.id] = fiche;
            }
            self.setState({
                selection: _.assign(_.clone(self.state.selection), tempSource),
                ajoutPanierEnCours: false
            });
        },
        removeFromSelection: (fiche) => {
            let tempSelection = _.clone(self.state.selection);
            if (typeof fiche.length !== "undefined") {
                // array
                _.each(fiche, (f) => {
                    if (typeof tempSelection[f.id]) {
                        delete tempSelection[f.id];
                    }
                });
            } else {
                if (typeof tempSelection[fiche.id]) {
                    delete tempSelection[fiche.id];
                }
            }
            self.setState({
                selection: tempSelection,
                ajoutPanierEnCours: false
            });
        },
        reloadResultats: _.debounce(() => {
            return self.reloadResultats();
        }, 250, {
            leading: true,
            trailing: true
        }),
        changeSelectionVisible: (visible) => {
            self.setState({
                selectionVisible: visible
            });
        },
        addPanierActif: () => {
            self.addPanierActif();
        }
    };
}

export function getDefaultContainerParamsCallbacks(self) {
    return {
        changeSerie: (serie) => {
            let tempSearchParams = {};
            tempSearchParams.serie = serie;
            tempSearchParams.sousSerie = null;
            tempSearchParams.sousSousSerie = null;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                listeReload: "sousSerie",
                listeReloadId: serie,
                requestedPage: 1 // reset la page
            });
        },
        changeSousSerie: (sousSerie) => {
            let tempSearchParams = {};
            tempSearchParams.sousSerie = sousSerie;
            tempSearchParams.sousSousSerie = null;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                listeReload: "sousSousSerie",
                listeReloadId: sousSerie,
                requestedPage: 1 // reset la page
            });
        },
        changeSousSousSerie: (sousSousSerie) => {
            let tempSearchParams = {};
            tempSearchParams.sousSousSerie = sousSousSerie;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                requestedPage: 1 // reset la page
            });
        },
        changeArticle: (article) => {
            let tempSearchParams = {};
            tempSearchParams.article = article;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                requestedPage: 1 // reset la page
            });
        },
        changeListe: (liste, valeur) => {
            let tempSearchParams = {};
            tempSearchParams[liste] = valeur;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                requestedPage: 1 // reset la page
            });
        },
        changeMagasin: (arbre) => {
            let tempSearchParams = {};
            if (!!arbre) {
                tempSearchParams.magasin = arbre.id;
                tempSearchParams.magasinLft = arbre.lft;
                tempSearchParams.magasinRgt = arbre.rgt;
                tempSearchParams.magasinRoot = arbre.root;
            } else {
                tempSearchParams.magasin = null;
                tempSearchParams.magasinLft = null;
                tempSearchParams.magasinRgt = null;
                tempSearchParams.magasinRoot = null;
            }
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                requestedPage: 1 // reset la page
            });
        },
        changeIntitule: (intitule) => {
            let tempSearchParams = {};
            tempSearchParams.intitule = intitule;
            self.setState({
                searchParams: _.assign(_.cloneDeep(self.state.searchParams), tempSearchParams),
                requestedPage: 1 // reset la page
            });
        },
        resetParams: () => {
            // definir tous les parametres a null
            // reloader les listes a vide
            self.setState({
                searchParams: _.cloneDeep(self.searchInit.params),
                searchChoices: _.cloneDeep(self.searchInit.choices),
                requestedPage: 1
            });
        }
    };
}

export function findLocalisation(idTablette, magasin) {
    if (typeof magasin === "undefined") return;
    if (magasin.length <= 0) return;
    for (var i = 0, l = magasin.length; i < l; i++) {
        if (Number(magasin[i].id) === Number(idTablette)) {
            return magasin[i];
        }
    }
    return false;
}