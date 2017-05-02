'use strict';

/*
Class HomeView : Gestion de la page/vue Home
*/

var HomeView = Backbone.View.extend({

    initialize:function(){
        //mise en cache des éléments DOM amenées à être modifiés
        this.$HomeContent = $("#HomeContent");
        this.$toggle = $(".home_toggler_toggle");
        this.$choiceToggler = $(".choice_toggler");
        this.$homeValidBt = $(".home_validbt");
        this.$homeMobileCriteriaBt = $(".home_criteriabt");

        this.isValid = false; //variable gérant la validité du formulaire de home
        this.nbCols = 4; //nombre de colonnes à afficher

        this.bindEvents();
        this.renderCriteria();
    },

    //génération des colonnes de critères
    renderCriteria:function(){
        var self = this;

        var choicesCols = {
            "pro":"homeProCol",
            "perso":"homePersoCol"
        };

        _.each(choicesCols, function(choiceCol, indexChoice){
            for(var incCol=1 ; incCol<=self.nbCols ; incCol++){
                var $criteriaCol = $("<div class='criteria_col'></div>");
                var colData = _.filter(App.utils.criteria, function(criterion){ return criterion[choiceCol] == incCol; });
                _.each(colData, function(criterion, indexCriterion){
                    var $homeCriterion = $("<div class='criterion home_criterion' data-criterion='"+criterion.id+"'></div>");
                    var $criterionTitle = $("<div class='criterion_title'>"+criterion.label+"</div>");
                    $homeCriterion.append($criterionTitle);

                    if(criterion.type == "list"){
                        var $criterionList = $("<div class='criterion_list' data-criterion='"+criterion.id+"'></div>");
                        _.each(criterion.options, function(option, indexOption){
                            var $listOption = "";
                            if(criterion.liststyle == "checkbox" && option.featured){
                                $listOption = $("<div class='list_option' data-type='checkbox' data-criterion='"+criterion.id+"' data-option='"+option.id+"'><a class='option_checkbox'></a><span class='option_label'>"+option.label+"</span></div>");
                            }else if(criterion.liststyle == "stars"){
                                $listOption = $("<div class='list_option' data-type='stars' data-criterion='"+criterion.id+"' data-option='"+option.id+"'><span class='option_stars' data-stars='"+indexOption+"'></span><span class='option_label'>"+option.label+"</span></div>"); 
                            }
                            
                            $criterionList.append($listOption);
                        });
                        $homeCriterion.append($criterionList);
                    }else if(criterion.type == "input"){
                        var $criterionInput = $("<input class='criterion_input' data-criterion='"+criterion.id+"' placeholder='"+criterion.placeholder+"' type='"+criterion.inputHTMLType+"' />");
                        if(criterion.inputtype == "autocomplete"){
                            $criterionInput.autocomplete({
                                source:criterion.autocompletelist,
                                select:function(event, ui){
                                    self.selectLocalisation($(event.target), ui);
                                }
                            });
                        }
                        $homeCriterion.append($criterionInput);
                    }

                    $criteriaCol.append($homeCriterion);
                });
                $(".criteria_block[data-option='"+indexChoice+"']").append($criteriaCol);
            }
        });

        $("#Home").attr("data-valid", this.isValid);
    },

    //mise à jour de la Home en fonction des séléctions
    updateHome:function(){
        $(".list_option").removeClass("selected");
        $(".criterion").attr("data-toggle", "false");
        $(".criterion_input").val("");

        _.each(App.selectedCriteria, function(criterion, indexCriterion){
            if(App.utils.criteria[indexCriterion].type == "input"){
                $(".criterion[data-criterion='"+indexCriterion+"']").attr("data-toggle", "true");
                $(".criterion_input[data-criterion='"+indexCriterion+"']").val(criterion.value);
            }else if(App.utils.criteria[indexCriterion].type == "list" && App.utils.criteria[indexCriterion].liststyle == "stars"){
                $(".criterion[data-criterion='"+indexCriterion+"']").attr("data-toggle", "true");
                $(".criterion_list[data-criterion='"+indexCriterion+"'] .list_option[data-option='"+criterion.value+"']").addClass("selected");
            }else{
                _.each(criterion.options, function(option){
                    $(".list_option[data-criterion='"+indexCriterion+"'][data-option='"+option+"']").addClass("selected");
                });
                if(criterion.options.length > 0){
                    $(".criterion[data-criterion='"+indexCriterion+"']").attr("data-toggle", "true");
                }
            }
        });

        if(App.selectedCriteria.categorie !== undefined && App.selectedCriteria.tarifmin !== undefined && App.selectedCriteria.localisation !== undefined){
            this.isValid = true;
        }else{
            this.isValid = false;
        }

        $("#Home").attr("data-valid", this.isValid);
    },

    // EVENTS
    bindEvents:function(){
        var self = this;

        this.$toggle.on("click", function(){
            self.toggleToggler();
        });

        $(".home_criteria .criteria_block").on("click", ".list_option[data-type='checkbox']", function(){
            self.toggleCheckboxCriterionOption($(this), false);
            self.updateHome();
        });

        $(".home_criteria .criteria_block").on("click", ".list_option[data-type='stars']", function(){
            self.toggleRadioCriterionOption($(this), false);
            self.updateHome();
        });

        $(".home_criteria .criteria_block").on("input", ".criterion_input", function(){
            self.updateCriterionInputValue($(this), false);
            self.updateHome();
        });

        this.$homeValidBt.on("click", function(){
            if(self.isValid) App.updateApp("search");
        });

        this.$homeMobileCriteriaBt.on("click", function(){
            App.searchView.$Search.attr("data-burgered", "true");
            App.$Body.attr("data-burgered", "true");
            if(self.isValid) App.updateApp("search");
        });
    },

    //action sur le toggle
    toggleToggler:function(){
        if(this.$choiceToggler.attr("data-option") == "pro"){
            this.selectedChoice = "perso";
        }else{
            this.selectedChoice = "pro";
        }

        this.$choiceToggler.attr("data-option", this.selectedChoice);
        this.$HomeContent.attr("data-choice", this.selectedChoice);
    },

    //mise à jour des critères de type checkbox
    toggleCheckboxCriterionOption:function($option, triggerSearch){
        var criterionID = $option.attr("data-criterion");
        var optionID = $option.attr("data-option");

        if($option.hasClass("selected")){
            $option.removeClass("selected");
            App.removeCheckboxCriterion(criterionID, optionID, triggerSearch);
        }else{
            $option.addClass("selected");
            App.addCheckboxCriterion(criterionID, optionID, triggerSearch);
        }
    },

    //mise à jour des critères de type radio
    toggleRadioCriterionOption:function($option, triggerSearch){
        var criterionID = $option.attr("data-criterion");
        var optionID = $option.attr("data-option");
        if($option.hasClass("selected")){
            $option.removeClass("selected");
            App.removeRadioCriterion(criterionID, triggerSearch);
        }else{
            var $criterionList = $(".criterion_list[data-criterion='"+criterionID+"']");
            $criterionList.find(".list_option").removeClass("selected");
            $option.addClass("selected");
            App.updateRadioCriterion(criterionID, optionID, triggerSearch);
        }
    },

    //mise à jour des critères de type input
    updateCriterionInputValue:function($input, triggerSearch){
        var criterionID = $input.attr("data-criterion");
        var inputValue = $input.val();

        if(inputValue !== ""){
            $input.addClass("active");
            App.updateInputCriterion(criterionID, inputValue, triggerSearch);
        }else{
            $input.removeClass("active");
            App.removeInputCriterion(criterionID, triggerSearch);
        }
    },

    //callback de séléction d'une ville
    selectLocalisation:function($input, ui){
        //this.updateCriterionInputValue($input, false);
        App.updateInputCriterion($input.attr("data-criterion"), ui.item.value, false);
        return false;
    }


});