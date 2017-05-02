"use strict";

/*
App : Composant racine du projet où les sous-vues, routers et utils sont créer
C'est dans ce fichier que la fonction principale du projet updateApp gère les différents états de l'application (home, recherhce, fiche produit)
*/


var App = {
    $Body:$("body"),
    $Sliders:$("#Sliders"),

    init: function init() {
        //fastlick : librairie pour gestion du touch rapide sous mobile
        FastClick.attach(document.body);

        //déclaration des sous-vues et du router utilisé par l'application
        this.utils = new Utils();
        this.router = new AppRouter();
        this.homeView = new HomeView();
        this.modalView = new ModalView();
        this.searchView = new SearchView();
        this.productView = new ProductView();
        this.fakeAPI = new FakeAPI();

        //paramètres par défaut de l'application
        this.selectedPage = "home";
        this.selectedCriteria = {};
        this.defaultCriteria = {
            /*"categorie":{ value:"3" },
            "tarifmin":{ value:50 },
            "localisation":{ value:"paris" },
            "activities":{options:["activitessurplace_equitation"]}*/
        };
        this.selectedCriteriaWeight = {};
        this.defaultCriteriaWeight = {
            /*"categorie":{weight:50, parent:"", id:"categorie"}, "tarifmin":{weight:50,parent:"", id:"tarifmin"}, "localisation":{weight:50,parent:"", id:"localisation"}, "activitessurplace_equitation":{weight:50,parent:"activities", id:"activitessurplace_equitation"}*/
        };
        this.selectedProductID = "hotel-diefwi-hezazof";
        this.matchingHotels = [];

        this.gatherData();
    },

    //récupération des fausses données de l'API
    gatherData:function(){
        this.fakeAPI.gatherData();
    },

    //callback un fois que les données sont chargées, démarrage du router
    start:function(){
        Backbone.history.start();
    },

    //callback du router après analyse du hash de l'url
    updateFromRouter:function(){
        this.bindEvents();
        this.updateApp();
    },

    //fonction de mise à jour de l'app en fonction de la page choisies et des paramètres determinés
    updateApp:function(pageID, params, triggerSearch){
        if(pageID !== this.selectedPage){
            $("#SearchContent")[0].scrollTop = 0;
            $("html")[0].scrollTop = 0;
            $("body")[0].scrollTop = 0;
        }

        if(pageID !== undefined) this.selectedPage = pageID;
        if(pageID == "product"){
            this.selectedProductID = params.hotelID;
            if(params.triggerScrollbar !== undefined) this.productView.isScrollItemClicked = params.triggerScrollbar;
        }

        this.$Body.attr("data-page", this.selectedPage);

        if(_.size(this.selectedCriteria) === 0){
            this.selectedCriteria = this.defaultCriteria;
            this.selectedCriteriaWeight = this.defaultCriteriaWeight;
        }

        this.apiCriteriaParams = App.utils.getApiParams(this.selectedCriteria, this.selectedCriteriaWeight);
        this.matchingHotels = this.fakeAPI.searchHotels(this.apiCriteriaParams);
        $(".nbhotels_figure").html(this.matchingHotels.length);

        if(this.selectedPage == "search"){
            if(!this.searchView.isFirstDisplayed){
                this.searchView.isFirstDisplayed = true;
            }
        }

        if(triggerSearch === undefined || triggerSearch === true){
            this.homeView.updateHome();
            this.searchView.updateSearchCriteria();
            this.searchView.updateResults();
            this.productView.updateProduct();
            this.router.updateRoute(false);
        }
    },

    updateMapPosition:function(latlng){
        this.apiCriteriaParams = App.utils.getApiParams(this.selectedCriteria, this.selectedCriteriaWeight, latlng);
        this.matchingHotels = this.fakeAPI.searchHotels(this.apiCriteriaParams);
        this.searchView.updateMapLocationFromClick(latlng);
        this.searchView.updateResults();
    },

    //suppression d'un critère de type checkbox
    removeCheckboxCriterion:function(criterionID, optionID, triggerSearch){
        if(this.selectedCriteria[criterionID] === undefined){}
        else{
            this.selectedCriteria[criterionID].options = _.without(this.selectedCriteria[criterionID].options, optionID);
            if(this.selectedCriteria[criterionID].options.length === 0) delete this.selectedCriteria[criterionID];
        }

        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    //ajout d'un critère de type checkbox
    addCheckboxCriterion:function(criterionID, optionID, triggerSearch){
        if(this.selectedCriteria[criterionID] === undefined){
            this.selectedCriteria[criterionID] = {
                options:[optionID]
            };
        }else{
            this.selectedCriteria[criterionID].options.push(optionID);
            this.selectedCriteria[criterionID].options = _.uniq(this.selectedCriteria[criterionID].options);
        }
        this.selectedCriteriaWeight[optionID] = {
            weight:50,
            parent:criterionID,
            id:optionID
        };

        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    //suppression d'un critère de type radio
    removeRadioCriterion:function(criterionID, triggerSearch){
        delete this.selectedCriteria[criterionID];
        
        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    //mise à jour d'un critère de type radio
    updateRadioCriterion:function(criterionID, optionID, triggerSearch){
        if(this.selectedCriteria[criterionID] === undefined){
            this.selectedCriteria[criterionID] = {
                value:optionID
            };
        }else{
            this.selectedCriteria[criterionID].value = optionID;
        }
        this.selectedCriteriaWeight[criterionID] = {
            weight:50,
            parent:"",
            id:criterionID
        };
        
        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    //mise à jour d'un critère de type input
    updateInputCriterion:function(criterionID, inputValue, triggerSearch){
        if(this.selectedCriteria[criterionID] === undefined){
            this.selectedCriteria[criterionID] = {
                value:inputValue
            };
        }else{
            this.selectedCriteria[criterionID].value = inputValue;
        }
        this.selectedCriteriaWeight[criterionID] = {
            weight:50,
            parent:"",
            id:criterionID
        };
        
        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    //suppression d'un critère de type input
    removeInputCriterion:function(criterionID, triggerSearch){
        delete this.selectedCriteria[criterionID];
        
        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

    // EVENTS
    bindEvents:function(){
        $(".cartridge_logo").on("click", function(){
            App.updateApp("home");
        });
    },

};

window.App = App;