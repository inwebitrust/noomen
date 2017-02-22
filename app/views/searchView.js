'use strict';

var SearchView = Backbone.View.extend({

    initialize:function(){
        this.isFirstDisplayed = false;
        this.hasBeenDisplayed = false;
        this.isWaveAnimated = true;
        this.searchMap = "";
        this.mapParams = {
            lat:48.856614,
            lng:2.352222,
            zoom:13
        };
        this.mapMarkers = [];

        this.$Search = $("#Search");
        this.$Sidebar = $("#SearchSidebar");
        this.$mapInput = $(".head_search_input");
        this.$contentMap = $(".content_map");
        this.$sidebarCriteria = $(".sidebar_criteria");
        this.$sidebarCriteriaList = $(".sidebar_criteria_list");
        this.$topList = $(".top_list");
        this.$otherList = $(".other_list");

        this.dragMaxPx = 230;
        this.draggableMaxPx = 219;

        this.customBigMapIcon = L.Icon.extend({
            options: {
                iconSize:     [24, 37],
                iconAnchor:   [12, 37],
                popupAnchor:  [0, -50]
            }
        });

        this.customSmallMapIcon = L.Icon.extend({
            options: {
                iconSize:     [16, 25],
                iconAnchor:   [8, 25],
                popupAnchor:  [0, -30]
            }
        });

        this.render();
    },

    render:function(){
        this.snapArea = Snap("#SVGWave");
        this.snapPath = this.snapArea.path("M0,0");
        this.snapPath.attr({
            id:"AreaChart",
            fill:"url(#linear)"
        });

        if($(".search_mobilemenu").css("display") == "none") this.renderMap(false);
        this.renderSearchCriteria();
    },

    renderMap:function(dataRendering){
        var self = this;

        if(this.searchMap === ""){
            this.searchMap = L.map('SearchMap').setView([this.mapParams.lat, this.mapParams.lng], this.mapParams.zoom);

            L.tileLayer.provider('CartoDB.Positron').addTo(this.searchMap);
            /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.searchMap);*/

            if(dataRendering){
                this.updateMapLocation();
                _.each(App.matchingHotels, function(hotel, index){
                    if(index < 3){
                        self.renderHotel(hotel, "top", index);
                    }
                    else self.renderHotel(hotel, "other", index);
                });
            }
        }
    },

    renderSearchCriteria:function(){
        var self = this;

        _.each(App.utils.criteria, function(criterion, indexCriterion){
            var $criterionBlock = "";
            var $criterionLabel= "";
            //var $criterionSlider = "";
            var $criterionDragger = "";
            var $criterionRemoveBt = "";

            if(criterion.type == "input"){
                $criterionBlock = $("<div class='criterion_block' data-criterion='"+criterion.id+"' data-type='input'></div>");
                $criterionRemoveBt = $("<a class='criterion_removebt' data-criterion='"+criterion.id+"'></a>");
                $criterionLabel = $("<div class='criterion_label'>"+criterion.label+"</div>");
                var $criterionInput = $("<input class='criterion_input' data-criterion='"+criterion.id+"' />");
                $criterionDragger = $("<div class='criterion_dragger_container' data-criterion='"+criterion.id+"'><div class='criterion_dragger_backbar'></div><div class='dragger_handle_backgradient'></div><div class='criterion_dragger_handle' data-criterion='"+criterion.id+"'></div><div class='dragger_bound bound_low'>-</div><div class='dragger_bound bound_up'>+</div></div>");
                //$criterionSlider = $("<div class='criterion_slider_container'><div class='criterion_slider' data-criterion='"+criterion.id+"'></div></div>");

                $criterionBlock
                                //.append($criterionInput)
                                //.append($criterionSlider)
                                .append($criterionDragger)
                                .append($criterionLabel);
                                //.append($criterionRemoveBt);
                self.$sidebarCriteriaList.append($criterionBlock);
            }else if(criterion.type == "list" && criterion.liststyle == "stars"){
                $criterionBlock = $("<div class='criterion_block' data-criterion='"+criterion.id+"' data-type='stars'></div>");
                $criterionRemoveBt = $("<a class='criterion_removebt'></a>");
                $criterionLabel = $("<div class='criterion_label'>"+criterion.label+"</div>");
                var $criterionSelectbox = $("<select class='criterion_select'></select>");
                //$criterionSlider = $("<div class='criterion_slider_container'><div class='criterion_slider' data-criterion='"+criterion.id+"'></div></div>");
                $criterionDragger = $("<div class='criterion_dragger_container' data-criterion='"+criterion.id+"'><div class='criterion_dragger_backbar'></div><div class='dragger_handle_backgradient'></div><div class='criterion_dragger_handle' data-criterion='"+criterion.id+"'></div><div class='dragger_bound bound_low'>-</div><div class='dragger_bound bound_up'>+</div></div>");
                _.each(criterion.options, function(option){
                    var $selectOption = $("<option value='"+option.id+"'>"+option.label+"</option>");
                    $criterionSelectbox.append($selectOption);
                });
                $criterionBlock
                                //.append($criterionSelectbox)
                                //.append($criterionSlider)
                                .append($criterionDragger)
                                .append($criterionLabel);
                                //.append($criterionRemoveBt);
                self.$sidebarCriteriaList.append($criterionBlock);
            }else{
                _.each(criterion.options, function(option){
                    $criterionBlock = $("<div class='criterion_block' data-criterion='"+criterion.id+"' data-option='"+option.id+"' data-type='option'></div>");
                    $criterionRemoveBt = $("<a class='criterion_removebt'></a>");
                    $criterionLabel = $("<div class='criterion_label'>"+criterion.label+" - "+option.label+"</div>");
                    //$criterionSlider = $("<div class='criterion_slider_container'><div class='criterion_slider' data-criterion='"+option.id+"'></div></div>");
                    $criterionDragger = $("<div class='criterion_dragger_container' data-criterion='"+option.id+"'><div class='criterion_dragger_backbar'></div><div class='dragger_handle_backgradient'></div><div class='criterion_dragger_handle' data-criterion='"+option.id+"'></div><div class='dragger_bound bound_low'>-</div><div class='dragger_bound bound_up'>+</div></div>");
                    $criterionBlock
                                    //.append($criterionSlider)
                                    .append($criterionDragger)
                                    .append($criterionLabel);
                                    //.append($criterionRemoveBt);
                    self.$sidebarCriteriaList.append($criterionBlock);
                });
            }
        });
    
        this.bindEvents();
    },

    updateSearchCriteria:function(){
        $(".criterion_block").removeClass("displayed");

        _.each(App.selectedCriteria, function(criterion, indexCriterion){
            if(App.utils.criteria[indexCriterion].type == "input"){
                $(".criterion_block[data-criterion='"+indexCriterion+"']").addClass("displayed");
                if(indexCriterion == "price"){
                    $(".criterion_block[data-criterion='"+indexCriterion+"'] .criterion_label").html("Tarif maximum : "+criterion.value+"€");
                }else if(indexCriterion == "localisation"){
                    $(".criterion_block[data-criterion='"+indexCriterion+"'] .criterion_label").html("Localisé à <span class='localisation_city'>"+criterion.value+"</span>");
                }
                //$(".criterion_block[data-criterion='"+indexCriterion+"'] .criterion_input").val(criterion.value);
            }else if(App.utils.criteria[indexCriterion].type == "list" && App.utils.criteria[indexCriterion].liststyle == "stars"){
                $(".criterion_block[data-criterion='"+indexCriterion+"']").addClass("displayed");
                $(".criterion_block[data-criterion='"+indexCriterion+"'] .criterion_label").html("Nombre d'étoiles : <span class='criterion_nbetoiles' data-etoiles='"+criterion.value+"'></span>");
                //$(".criterion_block[data-criterion='"+indexCriterion+"'] .criterion_select").val(criterion.value);
            }else{
                _.each(criterion.options, function(option){
                    $(".criterion_block[data-criterion='"+indexCriterion+"'][data-option='"+option+"']").addClass("displayed");
                });
            }
        });

        this.updateMapLocation();

        if(this.isFirstDisplayed && !this.hasBeenDisplayed){
            this.intialAnimateSliders();
        }
    },

    updateMapLocation:function(){
        if(App.selectedCriteria.localisation !== undefined) $(".head_search_input").val(App.selectedCriteria.localisation.value);
        else $(".head_search_input").val("");

        if(App.selectedCriteria.localisation === undefined){
            if(this.searchMap !== "") this.searchMap.setView([App.utils.citiesParams.france.lat.center, App.utils.citiesParams.france.lng.center], 5);
        }else{
            var slugLocalisation = _.str.slugify(App.selectedCriteria.localisation.value);
            if(this.searchMap !== "") this.searchMap.setView([App.utils.citiesParams[slugLocalisation].lat.center, App.utils.citiesParams[slugLocalisation].lng.center], 11);
        }
    },

    updateResults:function(){
        var self = this;

        $(".top_tuile").addClass("toleave");
        $(".other_tuile").addClass("toleave");

        if(this.searchMap !== ""){
            _.each(this.mapMarkers, function(marker){
                self.searchMap.removeLayer(marker);
            });
        }
        

        _.each(App.matchingHotels, function(hotel, index){
            if(index < 3){
                self.renderHotel(hotel, "top", index);
            }
            else self.renderHotel(hotel, "other", index);
        });

        $(".other_nb").html(App.matchingHotels.length - 3);

        setTimeout(function(){
            $(".tuile.toappear").removeClass("toappear");
        }, 650);

        setTimeout(function(){
            $(".tuile.toleave").addClass("leaving");
            setTimeout(function(){
                $(".tuile.toleave").remove();
            }, 500);
        }, 100);
    },

    renderHotel:function(hotel, container, ranking){
        if(this.searchMap !== "") this.renderMarker(hotel, container, ranking);
        var $tuileCriteria = $("<div class='tuile_criteria'></div>");
        var $tuileCriteriaMobile = $("<div class='tuile_criteriamobile'><div class='criteriamobile_bar'><div class='criteriamobile_jauge'></div></div><div class='criteriamobile_text'><div class='criteriamobile_text_satisfaction'><span class='satisfaction_nb'></span> de vos critères satisfaits</div><a class='crtieriamobile_detailsbt' data-tuileid='"+hotel.id+"'>détails</a></div></div>");
        
        var nbCriteria = 0;
        var sortedCriteria = _.sortBy(App.selectedCriteriaWeight, function(cw){ return -cw.weight; });

        _.each(sortedCriteria, function(criterion){
            var criterionID = criterion.id;
            var $tuileCriterion = "";
            var $criterionMatchingIcon = "";
            var $criterionLabel = "";
            if(criterion.parent !== ""){
                var foundOption = _.find(App.utils.criteria[criterion.parent].options, function(o){
                    return o.id == criterionID;
                });
                $tuileCriterion = $("<div class='tuile_criterion' data-criterion='"+criterionID+"'></div>");
                $criterionMatchingIcon =$("<div class='criterion_matchingincon'></div>");
                $criterionLabel = $("<span class='criterion_label'>"+foundOption.label+"</span>");
                $tuileCriterion.append($criterionMatchingIcon)
                                .append($criterionLabel);
                $tuileCriteria.append($tuileCriterion);
                nbCriteria += 1;
            }else{
                $tuileCriterion = $("<div class='tuile_criterion' data-criterion='"+criterionID+"'></div>");
                $criterionMatchingIcon = $("<div class='criterion_matchingincon'></div>");
                $criterionLabel = $("<span class='criterion_label'>"+App.utils.criteria[criterionID].tuileLabel+" : "+hotel[criterionID]+"</span>");
                $tuileCriterion.append($criterionMatchingIcon)
                                    .append($criterionLabel);
                $tuileCriteria.append($tuileCriterion);
                nbCriteria += 1;
            }
        });
    
        _.each(hotel.matchingCriteria, function(matchCriterion){
            $tuileCriteria.find(".tuile_criterion[data-criterion='"+matchCriterion+"']").addClass("matching");
        });
        var pctMatching = Math.round((hotel.matchingCriteria.length / nbCriteria) * 100);
        $tuileCriteriaMobile.find(".criteriamobile_jauge").css("width", pctMatching + "%");
        $tuileCriteriaMobile.find(".satisfaction_nb").html(pctMatching+"%");

        var $foundHotel = $(".tuile[data-tuileid='"+hotel.id+"']");
        if($foundHotel.length > 0){
            if(($foundHotel.hasClass("top_tuile") && container == "top") || ($foundHotel.hasClass("other_tuile") && container == "other")){
                $foundHotel.removeClass("toleave");
                var $foundHotelCriteria = $foundHotel.find(".tuile_criteria");
                $foundHotelCriteria.empty();
                $foundHotelCriteria.append($tuileCriteria.html());
                return false;
            }
        }

        var $tuile = $("<div class='tuile "+container+"_tuile toappear' data-tuileid='"+hotel.id+"' data-matching='"+hotel.matchingCoeff+"' data-infos='criteria'></div>");
        var $tuileImage = $("<div class='tuile_image' data-tuileid='"+hotel.id+"' style='background-image:url(images/hotels/hotel-"+hotel.imageID+".jpeg);'></div>");
        
        var $tuileContent = $("<div class='tuile_content'></div>");
        var $tuileTitle = $("<div class='tuile_title' data-tuileid='"+hotel.id+"'>"+hotel.name+"</div>");
        var $tuileBook = $("<div class='tuile_book'><a class='tuile_book_bt'>Réserver</a><a class='tuile_book_morebt' data-tuileid='"+hotel.id+"'>Infos utiles</a></div>");

        var $tuileMoreInfos = $("<div class='tuile_moreinfos'><div class='moreinfos_address'> 1 place Foch<br />41800<br />MONTOIRE-SUR-LE-LOIRE</div><a class='moreinfos_link' href='http://hotelaubiniere.fr' target='_blank'>www.hotelAubiniere.fr</a></div>");

        $tuileContent.append($tuileTitle)
                    .append($tuileBook);
        $tuileContent.append($tuileCriteria)
                    .append($tuileMoreInfos)
                    .append($tuileCriteriaMobile);

        var $tuileEnter = $("<a class='tuile_enterbt' data-tuileid='"+hotel.id+"'></a>");

        $tuile.append($tuileImage)
                .append($tuileContent)
                .append($tuileEnter);

        if(container == "top") this.$topList.append($tuile);
        else this.$otherList.append($tuile);
    },

    renderMarker:function(hotel, container, ranking){
        var customIcon = "";
        if(container == "top") customIcon = new this.customBigMapIcon({iconUrl:"images/map/icon-map-cyan.svg" });
        else customIcon = new this.customSmallMapIcon({iconUrl:"images/map/icon-map-blue.svg" });

        var marker = L.marker([hotel.latlng.lat, hotel.latlng.lng], {icon:customIcon, productID:hotel.id}).addTo(this.searchMap);
        marker.bindPopup("<span class='popup_title'>"+hotel.name+"</span><br /><span class='popup_localisation'>"+hotel.localisation+"</span><br /><span class='popup_ranking'>"+App.utils.renderRanking(ranking)+" dans le classement</span>");

        marker.on("mouseover", function(e){
            this.openPopup();
        });
        marker.on("mouseout", function(e){
            this.closePopup();
        });
        marker.on("click", function(e,u){
            App.updateApp("product", { hotelID:e.target.options.productID, triggerScrollbar:true });
        });

        this.mapMarkers.push(marker);
    },

    bindEvents:function(){
        var self = this;

        $(".map_head_hidebt").on("click", function(){
            self.toggleMapVisibility();
        });

        $(".sidebar_criteria_list").on("click", ".criterion_removebt", function(){
            self.removeCriterion($(this));
        });

        $(".sidebar_criteria_addbt").on("click", function(){
            self.displaySearchModal();
        });

        $(".cartridge_helpbt").on("click", function(){
            self.displayHelpModal();
        });

        $(".content_results").on("click", ".tuile_enterbt, .tuile_image, .tuile_title", function(){
            self.enterTuile($(this));
        });

        this.$mapInput.autocomplete({
            source:App.utils.criteria.localisation.autocompletelist,
            select:function(event, ui){
                self.selectLocalisation(ui);
            }
        });

        $(".content_results").on("click", ".tuile_book_morebt", function(){
            self.toggleInfos($(this));
        });

        $(".content_results").on("click", ".crtieriamobile_detailsbt", function(){
            self.toggleCriteriaMobile($(this));
        });

        this.bindMobileEvents();
        this.bindSlidersEvent();
    },

    selectLocalisation:function(ui){
        App.updateInputCriterion("localisation", ui.item.value, true);
    },

    bindMobileEvents:function(){
        var self = this;

        $(".sidebar_burgermenu").on("click", function(){
            /*if(self.$Search.attr("data-burgered") == "true"){
                self.$Search.attr("data-burgered", "false");
                App.$Body.attr("data-burgered", "false");
            }else{
                self.$Search.attr("data-burgered", "true");
                App.$Body.attr("data-burgered", "true");
            }*/
        });

        $(".mobile_action_seeresults").on("click", function(){
            self.$Search.attr("data-burgered", "false");
            App.$Body.attr("data-burgered", "false");
            App.modalView.closeModal();
        });

        $(".mobile_action_seecriteria").on("click", function(){
            self.$Search.attr("data-burgered", "true");
            App.$Body.attr("data-burgered", "true");
            App.modalView.closeModal();
        });

        $(".mobile_action_addcriteria").on("click", function(){
            self.displaySearchModal();
        });

        $(".mobilemenu_link_map").on("click", function(){
            self.$Search.attr("data-mobilemap", "true");
            self.renderMap(true);
        });

        $(".mobilemenu_link_list").on("click", function(){
            self.$Search.attr("data-mobilemap", "false");
        });
    },

    bindSlidersEvent:function(){
        var self = this;
        /*$(".criterion_slider").slider({
            orientation:"horizontal",
            range:"min",
            animate:"false",
            slide:function(event, ui){
                //self.updateSliderValue(event.target, ui);
            },
            stop:function(event, ui){
                self.updateSliderValue(event.target, ui);
            }
        });

        $(".criterion_slider").slider("value", 50);*/

        $(".criterion_dragger_handle").draggable({
            axis:"x",
            containment:"parent",
            drag: function(e) {
                var $target = $(e.target);
                var $container = $target.parent(".criterion_dragger_container");
                var $backgradient = $container.find(".dragger_handle_backgradient");

                var dragLeft = $target.position().left;
                $backgradient.css("width", dragLeft + "px");
                var dragValue = Math.round((dragLeft*100) / self.dragMaxPx);
                self.updateSnapPath();
            },
            stop: function(e) {
                var $target = $(e.target);
                var criterionID = $target.attr("data-criterion");
                var $container = $target.parent(".criterion_dragger_container");
                var $backgradient = $container.find(".dragger_handle_backgradient");

                var dragLeft = $target.position().left;
                $backgradient.css("width", dragLeft + "px");
                
                var dragValue = Math.round((dragLeft*100) / self.dragMaxPx);
                self.updateCriterionWeight(criterionID, dragValue);
                self.updateSnapPath();
            }
        });

        $(".criterion_dragger_container").on("click", function(e){
            var $container = $(this);
            var criterionID = $container.attr("data-criterion");
            var diffPx = e.pageX - $container.offset().left;
            if(diffPx < 0) diffPx = 0;
            else if(diffPx > self.draggableMaxPx) diffPx = self.draggableMaxPx;

            var $handle = $container.find(".criterion_dragger_handle");
            var $backgradient = $container.find(".dragger_handle_backgradient");
            $handle.css("left", diffPx + "px");
            $backgradient.css("width", diffPx + "px");

            var dragValue = Math.round((diffPx*100) / self.dragMaxPx);
            self.updateCriterionWeight(criterionID, dragValue);
            self.updateSnapPath();
        });

        $(".dragger_bound.bound_low").on("click", function(e){
            var $target = $(this);
            var $container = $target.parent(".criterion_dragger_container");
            var criterionID = $container.attr("data-criterion");

            var $handle = $container.find(".criterion_dragger_handle");
            var $backgradient = $container.find(".dragger_handle_backgradient");
            $handle.css("left", 0 + "px");
            $backgradient.css("width", 0 + "px");

            self.updateCriterionWeight(criterionID, 0);
            self.updateSnapPath();
            return false;
        });

        $(".dragger_bound.bound_up").on("click", function(e){
            var $target = $(this);
            var $container = $target.parent(".criterion_dragger_container");
            var criterionID = $container.attr("data-criterion");

            var $handle = $container.find(".criterion_dragger_handle");
            var $backgradient = $container.find(".dragger_handle_backgradient");
            $handle.css("left", self.draggableMaxPx + "px");
            $backgradient.css("width", self.draggableMaxPx + "px");

            self.updateCriterionWeight(criterionID, 100);
            self.updateSnapPath();
            return false;
        });
    },

    intialAnimateSliders:function(){
        var self = this;

        var handles = $(".criterion_block.displayed .criterion_dragger_handle");
        var backgradients = $(".criterion_block.displayed .dragger_handle_backgradient");
        _.each(handles, function(handle, index){
            var $handle = $(handle);
            var $backGradient = $(backgradients[index]);
            var $container = $handle.parent(".criterion_dragger_container");
            var criterionID = $container.attr("data-criterion");

            var midLeft = self.draggableMaxPx / 2;
            if(criterionID == "price"){ midLeft = self.draggableMaxPx; }
            else if(criterionID == "localisation"){ midLeft = self.draggableMaxPx /1.5; }
            else if(criterionID == "confort"){ midLeft = self.draggableMaxPx / 2; }
            else{
                midLeft = self.draggableMaxPx / ( 2 + Math.random()*2);
            }

            $handle.addClass("animated");
            $backGradient.addClass("animated");
            setTimeout(function(){
                $handle.css("left", midLeft+"px");
                $backGradient.css("width", midLeft+"px");
            }, 1000 + ( 200 * (index + 1)) );
        });

        setTimeout(function(){
            $(".criterion_dragger_handle").removeClass("animated");
            $(".dragger_handle_backgradient").removeClass("animated");
        }, 1000 + (200 * (handles.length + 2)));

        setTimeout(function(){
            self.isWaveAnimated = false;
        }, 1000 + (200 * (handles.length + 20)));

        this.isFirstDisplayed = false;
        this.hasBeenDisplayed = true;
        /*$(".criterion_slider").slider("value", 0);
        setTimeout(function(){
            _.each($(".criterion_block.displayed .criterion_slider"), function(slider, index){
                var $slider = $(slider);
                setTimeout(function(){
                    $slider.slider("value", 50);
                }, 200*index);
            });
            setTimeout(function(){
                $(".criterion_slider").slider("value", 50);
            }, 200 * $(".criterion_block.displayed .criterion_slider").length);
        }, 1000);*/

        this.initialAnimateWave();
    },

    initialAnimateWave:function(){
        var self = this;
        if(this.isWaveAnimated){
            this.updateSnapPath();
            setTimeout(function(){
                self.initialAnimateWave();
            }, 10);
        }
    },

    updateSliderValue:function(slider, ui){
        var $slider = $(slider);
        var criterionID = $slider.attr("data-criterion");
        this.updateCriterionWeight(criterionID, ui.value);
    },

    updateCriterionWeight:function(criterionID, weight){
        App.selectedCriteriaWeight[criterionID].weight = weight;
        App.updateApp("search");
    },

    toggleMapVisibility:function(){
        if(this.$contentMap.attr("data-visible") == "show"){
            this.$contentMap.attr("data-visible", "hide");
        }else{
            this.$contentMap.attr("data-visible", "show");
        }
    },

    removeCriterion:function($criterionRemoveBt){
        var $criterionBlock = $criterionRemoveBt.parent(".criterion_block");
        var criterionID = $criterionBlock.attr("data-criterion");
        var criterionType = $criterionBlock.attr("data-type");

        var optionID = "";
        if($criterionBlock.attr("data-option") !== ""){
            optionID = $criterionBlock.attr("data-option");
        }

        if(criterionType == "stars"){
            App.removeRadioCriterion(criterionID, true);
        }else if(criterionType == "input"){
            App.removeInputCriterion(criterionID, true);
        }else{
            App.removeCheckboxCriterion(criterionID, optionID, true);
        }
    },

    enterTuile:function($tuileBt){
        App.updateApp("product", { hotelID:$tuileBt.attr("data-tuileid"), triggerScrollbar:true });
    },

    toggleInfos:function($tuileBtInfos){
        var tuileID = $tuileBtInfos.attr("data-tuileid");
        var $tuile = $(".tuile[data-tuileid='"+tuileID+"']");

        if($tuile.attr("data-infos") == "criteria"){
            $tuile.attr("data-infos", "more");
        }else{
            $tuile.attr("data-infos", "criteria");
        }
    },

    toggleCriteriaMobile:function($bt){
        var tuileID = $bt.attr("data-tuileid");
        var $tuile = $(".tuile[data-tuileid='"+tuileID+"']");

        if($tuile.attr("data-infos") == "criteria" || $tuile.attr("data-infos") == "more"){
            $tuile.attr("data-infos", "criteriamobile");
        }else{
            $tuile.attr("data-infos", "criteria");
        }
    },

    displaySearchModal:function(){
        App.modalView.closeSearching();
        $("#SearchModalContainer").addClass("displayed");
    },

    displayHelpModal:function(){
        $("#HelpModalContainer").addClass("displayed");
    },


    updateSnapPath:function(){
        var $container = $(".sidebar_criteria");
        $("#SVGWave").css("height", $(".sidebar_criteria_list")[0].scrollHeight + "px");
        var scrollListOffset = $(".sidebar_criteria_list")[0].scrollTop;
        var containerPosition = $container.offset();

        var slidersPosition = [];
        var sliderHandlesPosition = [];
        _.each($(".criterion_block.displayed .criterion_dragger_container"), function(sliderElem, index){
            var $slider = $(sliderElem);
            var $sliderHandle =  $slider.find(".criterion_dragger_handle");
            var sliderPosition = {
                left:$slider.offset().left - containerPosition.left,
                top:(($slider.offset().top + scrollListOffset) + 15) - containerPosition.top - 44,
            };
            slidersPosition.push(sliderPosition);
            var sliderHandlePosition = {
                left:($sliderHandle.offset().left - 4) - containerPosition.left,
                top:( ($sliderHandle.offset().top + scrollListOffset) + ($sliderHandle.height() / 2) +8) - containerPosition.top - 44,
            };
            sliderHandlesPosition.push(sliderHandlePosition);
        });
        var sliderHandlesLength = sliderHandlesPosition.length;

        var pathString = this.getPath("M", {
            x1:null,
            y1:null,
            x2:slidersPosition[0].left,
            y2:slidersPosition[0].top
        });
        pathString += this.getPath("L", {
            x1:slidersPosition[0].left,
            y1:slidersPosition[0].top,
            x2:sliderHandlesPosition[0].left,
            y2:sliderHandlesPosition[0].top
        });

        for(var i=1; i<sliderHandlesLength - 1; i++){
            pathString += this.getPath("C", {
                x1:sliderHandlesPosition[i-1].left,
                y1:sliderHandlesPosition[i-1].top,
                x2:sliderHandlesPosition[i].left,
                y2:sliderHandlesPosition[i].top
            });
        }

        pathString += this.getPath("C", {
            x1:sliderHandlesPosition[sliderHandlesLength - 2].left,
            y1:sliderHandlesPosition[sliderHandlesLength - 2].top,
            x2:sliderHandlesPosition[sliderHandlesLength - 1].left,
            y2:sliderHandlesPosition[sliderHandlesLength - 1].top
        });
        pathString += this.getPath("L",{
            x1:sliderHandlesPosition[sliderHandlesLength - 1].left,
            y1:sliderHandlesPosition[sliderHandlesLength - 1].top,
            x2:slidersPosition[sliderHandlesLength - 1].left,
            y2:slidersPosition[sliderHandlesLength - 1].top
        });

        this.snapPath.attr({
            "d":pathString
        });
    },

    getPath:function(joinType, coords){
        if(joinType == "M"){
            return "M" + coords.x2 + " " + coords.y2;
        }else if(joinType == "L"){
            return "L" + coords.x2 + " " + coords.y2;
        }else if(joinType == "Q"){
            var qx = coords.x2 + ((coords.x1 - coords.x2) / 2);
            if(coords.x2 > coords.x1) qx = coords.x1 + ((coords.x2 - coords.x1) / 2);
            var qy = coords.y2 + ((coords.y1 - coords.y2) / 2);
            if(coords.y2 > coords.y1) qy = coords.y1 + ((coords.y2 - coords.y1) / 2);
            return "Q" + (qx-50) + " " + qy + " " + coords.x2 + " " + coords.y2;
        }else if(joinType == "C"){
            var cFactor = {
                x:0,
                y:30
            };
            return "C" + (coords.x1 + cFactor.x) + " " + (coords.y1 + cFactor.y) + " " + (coords.x2 - cFactor.x) + " " + (coords.y2 - cFactor.y) + " " + coords.x2 + " " + coords.y2;
        }
    }
});

module.exports = SearchView;