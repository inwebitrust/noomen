"use strict";

var App = {
    $Body:$("body"),
    $Sliders:$("#Sliders"),

    init: function init() {
        FastClick.attach(document.body);

        var Utils = require("utils");
        this.utils = new Utils();

        var Router = require("router");
        this.router = new Router();

        var HomeView = require("views/homeView");
        this.homeView = new HomeView();

        var ModalView = require("views/modalView");
        this.modalView = new ModalView();

        var SearchView = require("views/searchView");
        this.searchView = new SearchView();

        var ProductView = require("views/productView");
        this.productView = new ProductView();

        var FakeAPI = require("fakeapi");
        this.fakeAPI = new FakeAPI();

        this.selectedPage = "home";
        this.selectedCriteria = {};
        this.defaultCriteria = {
            /*"confort":{ value:"3" },
            "price":{ value:50 },
            "localisation":{ value:"paris" },
            "activities":{ options:["equitation", "golf"] },
            "accessto":{ options:["piscine"] }*/
        };
        this.selectedCriteriaWeight = {};
        this.defaultCriteriaWeight = {
            /*"confort":{weight:50, parent:"", id:"confort"}, "price":{weight:50,parent:"", id:"price"}, "localisation":{weight:50,parent:"", id:"localisation"}, "equitation":{weight:50,parent:"activities", id:"equitation"}, "golf":{weight:50,parent:"activities", id:"golf"}, "piscine":{weight:50, parent:"accessto", id:"piscine"}*/
        };
        this.selectedProductID = "hotel-diefwi-hezazof";
        this.matchingHotels = [];

        this.gatherData();
    },

    gatherData:function(){
        this.fakeAPI.gatherData();
    },

    start:function(){
        Backbone.history.start();
    },

    updateFromRouter:function(){
        this.bindEvents();
        this.render();
        this.updateApp();
    },

    render:function(){
          
    },

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
        this.matchingHotels = this.fakeAPI.searchHotels(this.selectedCriteria, this.selectedCriteriaWeight);
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

    removeCheckboxCriterion:function(criterionID, optionID, triggerSearch){
        if(this.selectedCriteria[criterionID] === undefined){}
        else{
            this.selectedCriteria[criterionID].options = _.without(this.selectedCriteria[criterionID].options, optionID);
            if(this.selectedCriteria[criterionID].options.length === 0) delete this.selectedCriteria[criterionID];
        }

        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

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

    removeRadioCriterion:function(criterionID, triggerSearch){
        delete this.selectedCriteria[criterionID];
        
        this.updateApp(this.selectedPage, {}, triggerSearch);
    },

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

module.exports = App;
window.App = App;