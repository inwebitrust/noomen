'use strict';

/*
Class ModalView : Gestion de la modale d'édition des critères
*/

var ModalView = Backbone.View.extend({

    initialize:function(){
        //mise en cache des éléments DOM amenées à être modifiés
        this.$modalCriteria = $(".modal_criteria");
        this.$choiceToggler = $(".modal_head_toggler");
        this.$toggle = $(".modal_toggler_toggle");
        this.$criteriaSearchResults = $(".modal_criteria_searchresults");
        this.$searchResultsList = $(".modal_criteria_searchresults .criterion_list");

        //paramètres par défaut
        this.selectedChoice = "all";
        this.nbCols = 4;
        this.render();  
    },

    render:function(){
        this.renderCriteria();

        this.bindEvents();
    },

    //génération des colonnes de critères
    renderCriteria:function(){
        var self = this;
        var choiceCol = "modalCol";

        for(var incCol=1 ; incCol<=self.nbCols ; incCol++){
            
            var $criteriaCol = $("<div class='criteria_col'></div>");
            var colData = _.filter(App.utils.criteria, function(criterion){ return criterion[choiceCol] == incCol; });
            _.each(colData, function(criterion, indexCriterion){
                var $homeCriterion = $("<div class='criterion modal_criterion' data-criterion='"+criterion.id+"'></div>");
                var $criterionTitle = $("<div class='criterion_title' data-criterion='"+criterion.id+"'>"+criterion.label+"<a class='criterion_title_togglebt' data-criterion='"+criterion.id+"'></a></div>");
                $homeCriterion.append($criterionTitle);

                if(criterion.type == "list"){
                    var $criterionList = $("<div class='criterion_list' data-criterion='"+criterion.id+"'></div>");
                    _.each(criterion.options, function(option, indexOption){
                        var $listOption = "";
                        if(criterion.liststyle == "checkbox"){
                            $listOption = $("<div class='list_option' data-type='checkbox' data-criterion='"+criterion.id+"' data-option='"+option.id+"' data-featured='"+option.featured+"'><a class='option_checkbox'></a><span class='option_label'>"+option.label+"</span></div>");
                        }else if(criterion.liststyle == "stars"){
                            $listOption = $("<div class='list_option' data-type='stars' data-criterion='"+criterion.id+"' data-option='"+option.id+"'><span class='option_stars' data-stars='"+indexOption+"'></span><span class='option_label'>"+option.label+"</span></div>"); 
                        }
                        
                        $criterionList.append($listOption);
                    });
                    $homeCriterion.append($criterionList);
                }else if(criterion.type == "input"){
                    var $criterionInput = $("<input class='criterion_input' data-criterion='"+criterion.id+"'  />");
                    $homeCriterion.append($criterionInput);
                }

                $criteriaCol.append($homeCriterion);
            });

            this.$modalCriteria.append($criteriaCol);
        }
    },

    // EVENTS
    bindEvents:function(){
        var self = this;

        this.$toggle.on("click", function(){
            self.toggleToggler();
        });

        $(".modal_criteria").on("click", ".list_option[data-type='checkbox']", function(){
            App.homeView.toggleCheckboxCriterionOption($(this), false);
        });

        $(".modal_criteria").on("click", ".list_option[data-type='stars']", function(){
            App.homeView.toggleRadioCriterionOption($(this), false);
        });

        $(".modal_criteria").on("input", ".criterion_input", function(){
            App.homeView.updateCriterionInputValue($(this), false);
        });

        $(".modal_criteria_searchresults").on("click", ".list_option", function(){
            App.homeView.toggleCheckboxCriterionOption($(this), false);
        });

        $(".modal_criteria").on("click", ".criterion_title", function(){
            self.toggleCriterionBlock($(this));
        });

        $(".modal_closebt").on("click", function(){
            self.closeModal();
        });

        $(".modal_okbt").on("click", function(){
            self.closeModal();
            App.updateApp("search");
        });

        $(".help_bt").on("click", function(){
            self.closeModal();
        });

        $(".searchbar_input").on("input", function(){
            self.searchCriteria($(this).val());
        });

        $(".searchbar_searchbt").on("click", function(){
            if($("#SearchModal").attr("data-searching") == "true"){
                self.closeSearching();
            }
        });
    },

    toggleToggler:function(){
        if(this.$choiceToggler.attr("data-option") == "all"){
            this.selectedChoice = "featured";
        }else{
            this.selectedChoice = "all";
        }

        this.$choiceToggler.attr("data-option", this.selectedChoice);
        this.$modalCriteria.attr("data-choice", this.selectedChoice);
    },

    //action sur le toggle
    toggleCriterionBlock:function($titleToggleBt){
        var criterionID = $titleToggleBt.attr("data-criterion");
        var $criterionBlock = $(".modal_criterion[data-criterion='"+criterionID+"']");
        var toggleCriterion = $criterionBlock.attr("data-toggle");
        if(toggleCriterion == "true") $criterionBlock.attr("data-toggle", "false");
        else $criterionBlock.attr("data-toggle", "true");
    },

    //bouton de fermeture de modal
    closeModal:function(){
        $(".modal_container").removeClass("displayed");
    },

    //recherche de critères
    searchCriteria:function(inputVal){
        var self = this;
        var matchingCriteria = [];
        var sanitizeSearchString = inputVal.toLowerCase();
        _.each(App.utils.autocompleteCriteriaList, function(criterion){
            var sanitizeCriterionLabel = criterion.label.toLowerCase();
            if(sanitizeCriterionLabel.split(sanitizeSearchString).length > 1){
                matchingCriteria.push(criterion);
            }
        });

        this.$searchResultsList.empty();
        $("#SearchModal").attr("data-searching", "true");
        $(".searchresults_nodata").removeClass("displayed");

        if(matchingCriteria.length > 0){
            _.each(matchingCriteria, function(matchCrit){
                var copyOptionHTML = $(".list_option[data-option='"+matchCrit.id+"']")[0].outerHTML;
                var $searchItem = $(copyOptionHTML);
                self.$searchResultsList.append($searchItem);
            });
        }else{
            $(".searchresults_nodata").addClass("displayed");
        }
    },

    //fermeture de la recherche de critères
    closeSearching:function(){
        $("#SearchModal").attr("data-searching", "false");
        $(".searchbar_input").val("");
    }

    
});

module.exports = ModalView;