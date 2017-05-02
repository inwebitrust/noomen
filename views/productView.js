'use strict';

/*
Class ProductView : Gestion de la page/vue Produit/Hôtel
*/

var ProductView = Backbone.View.extend({

    initialize:function(){
        //mise en cache des éléments DOM amenées à être modifiés
        this.$sidebarList = $(".sidebar_list");
        this.$productVisuel = $(".product_visuel");
        this.$infosTextTitle = $(".infos_text_title");
        this.$infosTextCriteria = $(".infos_text_criteria");

        //paramètres par défaut
        this.selectedProductID = "";
        this.isScrollItemClicked = false;
        this.isScrollAnimated = false;
        this.sidebarItemHeight = 80;

        //paramètres de l'objet hotel ne correspondant pas à des critères
        this.noCriteriaIndex = ["imageID", "id", "name", "matchingCoeff"];

        this.bindEvents();
    },

    //mise à jour de la page produit
    updateProduct:function(){
        var self = this;

        if(this.selectedProductID !== App.selectedProductID){
            this.selectedProductID = App.selectedProductID;
        }else{
            return false;
        }

        var foundHotel = _.find(App.matchingHotels, function(h){ return h.id == self.selectedProductID; });

        if(foundHotel === undefined) return false;

        this.$productVisuel.css("background-image", "url('images/hotels/hotel-"+foundHotel.imageID+".jpeg')");
        this.$infosTextTitle.html(foundHotel.name);

        this.$infosTextCriteria.empty();

        _.each(foundHotel, function(attr, index){
            var $criterion = "";
            if(_.indexOf(self.noCriteriaIndex, index) == -1){
                if(typeof attr == "object"){
                    _.each(attr, function(optionValue, optionIndex){
                        if(optionValue === true){
                            var foundOption = _.find(App.utils.criteria[index].options, function(o){ return o.id == optionIndex; });
                            $criterion = $("<div class='criterion'>"+foundOption.label+"</div>");
                            self.$infosTextCriteria.append($criterion);    
                        }
                    });
                }else{
                    $criterion = $("<div class='criterion'>"+App.utils.criteria[index].tuileLabel+" : "+ attr +"</div>");
                    self.$infosTextCriteria.append($criterion);
                } 
            }
        });

        this.renderChart();
        this.updateSidebar();
    },

    //mise à jour de la sidebar de la page produit
    updateSidebar:function(){
        var self = this;
        this.$sidebarList.empty();

        _.each(App.matchingHotels, function(hotel, index){
            var itemRank = "other";
            if(index < 3) itemRank = "top";
            var $listItem = $("<div class='list_item' data-rank='"+itemRank+"' data-productid='"+hotel.id+"' data-inc='"+index+"'></div>");
            var $itemText = $("<div class='item_text'></div>");
            var $itemLabel = $("<div class='item_label'>"+hotel.name+"</div>");
            var $itemDesc = $("<div class='item_desc'>Lorem ipsum dolor sit amet...</div>");

            $itemText.append($itemLabel)
                    .append($itemDesc);
            $listItem.append($itemText);

            self.$sidebarList.append($listItem);
        });

        this.updateScrollSidebar();
    },

    //mise à jour après un scrol dans la sidebar
    updateScrollSidebar:function(){
        var self = this;

        $(".sidebar_list .list_item").removeClass("selected");
        var $selectedItem = $(".sidebar_list .list_item[data-productid='"+this.selectedProductID+"']");
        $selectedItem.addClass("selected");

        var inc = parseInt($selectedItem.attr("data-inc"), 10);

        if(this.isScrollItemClicked){
            this.isScrollAnimated = true;
            App.productView.$sidebarList.animate({
                scrollTop: inc * self.sidebarItemHeight 
            }, 500, function(){
                setTimeout(function(){
                    self.isScrollItemClicked = false;
                    self.isScrollAnimated = false;
                }, 100);
            });
        }
    },

    //génération du polar chart (diagramme en étoile radar)
    renderChart:function(){
        var self = this;
        var foundHotel = _.find(App.matchingHotels, function(h){ return h.id == App.selectedProductID; });
        this.polarCategories = _.keys(App.selectedCriteriaWeight);

        this.polarValues = [];
        for(var i=0 ; i<this.polarCategories.length; i++){
            if(foundHotel !== undefined){
                var criterionParentID = App.selectedCriteriaWeight[this.polarCategories[i]].parent;
                if(criterionParentID === ""){
                    if(this.polarCategories[i] == "tarifmin"){
                        var diffPrice = Math.abs(foundHotel[this.polarCategories[i]] - App.selectedCriteria[this.polarCategories[i]].value);
                        if(diffPrice < 10){
                            this.polarValues.push(100);
                        }else if(diffPrice < 25){
                            this.polarValues.push(75);
                        }else if(diffPrice < 50){
                            this.polarValues.push(50);
                        }else if(diffPrice < 75){
                            this.polarValues.push(25);
                        }else if(diffPrice < 100){
                            this.polarValues.push(10);
                        }else{
                            this.polarValues.push(0);
                        }
                    }else if(this.polarCategories[i] == "localisation"){
                        if(foundHotel[this.polarCategories[i]] == App.selectedCriteria[this.polarCategories[i]].value){
                            this.polarValues.push(100);
                        }else{
                            this.polarValues.push(0);   
                        }
                    }else if(this.polarCategories[i] == "categorie"){
                        var diffCategorie = Math.abs(foundHotel[this.polarCategories[i]] - App.selectedCriteria[this.polarCategories[i]].value);
                        switch(diffCategorie){
                            case 0: this.polarValues.push(100); break;
                            case 1: this.polarValues.push(50); break;
                            case 2: this.polarValues.push(25); break;
                            case 3: this.polarValues.push(10); break;
                            default: this.polarValues.push(0);
                        }
                    }
                }else{
                    if(foundHotel[criterionParentID][this.polarCategories[i]]){
                        this.polarValues.push(100);
                    }else{
                        this.polarValues.push(0);
                    }
                }
            }else{
                this.polarValues.push(Math.round(Math.random()*100));
            }
        }

        this.polarHighcharts = new Highcharts.Chart({
            chart: {
                polar: true,
                type: 'line',
                renderTo:"ProductChart",
                backgroundColor:"#547483"
            },

            credits:{
                enabled:false
            },

            title: {
                text: '',
                enabled:false,
            },

            pane: {
                size: '70%'
            },

            xAxis: {
                categories: self.polarCategories,
                tickmarkPlacement: 'on',
                lineWidth: 0,
                labels:{
                    style:{
                        "color":"#fff",
                        "font-family":"robotoregular",
                        "font-size":"12px"
                    }
                }
            },

            yAxis: {
                lineWidth: 0,
                min: 0,
                tickAmount:5,
                max: 100,
                labels:{
                    enabled:false,
                    style:{
                        "color":"#134b6e",
                        "font-family":"robotoregular",
                        "font-size":"11px"
                    }
                }
            },

            tooltip: {
                shared: true,
                useHTML:true,
                formatter:function(){
                    var html = "";
                    html += "<span><b>" + this.x + "</b></span><br />";
                    _.each(this.points, function(p){
                        var note = p.y;
                        if(note === 0) note = "non défini";
                        html += "<span style='color:"+p.color+";'>"+p.series.name+" : </span><b>"+note+"</b><br />";
                    });
                    return html;
                }
            },

            legend: {
                enabled:false
            },

            series: [{
                name: 'Évaluation des critères',
                type:'area',
                data: self.polarValues,
                pointPlacement: 'on',
                color:"#51bed2"
            }]
        });
    },

    // EVENTS
    bindEvents:function(){
        var self = this;
        $(".product_calltosearch_bt").on("click", function(){
            App.updateApp("search");
        });

        $(".sidebar_list").on("click", ".list_item", function(){
            self.isScrollItemClicked = true;
            App.updateApp("product", { hotelID: $(this).attr("data-productid") });
        });

        $(".sidebar_list").on("scroll", function(){
            if(!self.isScrollAnimated){
                self.manualScrolling();
            }
        });

        $(".infos_text_arrows .arrow_prev").on("click", function(){
            self.goToProduct("prev");
        });

        $(".infos_text_arrows .arrow_next").on("click", function(){
            self.goToProduct("next");
        });
    },

    //callback après un scroll manuel dans la sidebar
    manualScrolling:function(){
        var currentScrollTop = this.$sidebarList.scrollTop();
        var incScroll = (currentScrollTop / this.sidebarItemHeight);
        var roundInc = Math.round(incScroll);

        var $incItem = $(".sidebar_list .list_item[data-inc='"+roundInc+"']");
        var productID = $incItem.attr("data-productid");
        if(productID !== this.selectedProductID){
            App.updateApp("product", { hotelID:productID, triggerScrollBar:false });
        }
    },

    //callback sur les flèches prev/next pour fair défiler les produits
    goToProduct:function(way){
        var $selectedProduct = $(".sidebar_list .list_item[data-productid='"+this.selectedProductID+"']");
        var incProduct = parseInt($selectedProduct.attr("data-inc"), 10);

        var gotoInc = 0;
        if(incProduct === 0 && way == "prev"){
            gotoInc = App.matchingHotels.length - 1;
        }else if(incProduct == (App.matchingHotels.length - 1) && way == "next"){
            gotoInc = 0;
        }else{
            if(way == "prev") gotoInc = incProduct - 1;
            else gotoInc = incProduct + 1;
        }
        var $incItem = $(".sidebar_list .list_item[data-inc='"+gotoInc+"']");
        var productID = $incItem.attr("data-productid");
        this.isScrollItemClicked = true;
        App.updateApp("product", { hotelID:productID });
    }
});