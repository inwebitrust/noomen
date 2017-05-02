'use strict';

/*
Fausse API pour créer un jeu de données de test des hôtels
Permet de générer une liste d'hôtels avec les critères associés
Permet de chercher dans la liste des hôtels ceux correspondants aux critères
*/


var FakeAPI = Backbone.View.extend({
    initialize:function(){
        this.hotelsList = [];
        this.nbHotels = 300;
        this.maxSearchHotels = 30;
    },

    //récupération des données crées dans hotels.json
    gatherData:function(){
        var self = this;
        $.getJSON("data/hotels.json", function(data){
            self.hotelsList = data;
            App.start();
        });
    },

    //génération des fausses données
    generateHotels:function(){
        var self = this;
        this.hotelsList = [];

        for(var i=0 ; i<this.nbHotels ; i++){

            var hotelName = "Hôtel " + chance.sentence({words: 2}).slice(0,-1);
            var hotelID = _.str.slugify(hotelName);
            var hotelImageID = chance.integer({min: 1, max: 20});

            var newHotel = {
                id:hotelID,
                name:hotelName,
                imageID:hotelImageID,
                matchingCoeff:0
            };

            _.each(App.utils.criteria, function(criterion){
                if(criterion.type == "input"){
                    if(criterion.id == "tarifmin"){
                        newHotel[criterion.id] = chance.integer({min: 20, max: 500});
                    }
                    else if(criterion.id == "localisation"){
                        var cityID = _.sample(criterion.autocompletelist).id;
                        console.log(cityID);
                        newHotel[criterion.id] = cityID;
                        newHotel.latlng = {
                            lat:chance.floating({min:App.utils.citiesParams[cityID].lat.min, max: App.utils.citiesParams[cityID].lat.max, fixed:6}),
                            lng:chance.floating({min:App.utils.citiesParams[cityID].lng.min, max: App.utils.citiesParams[cityID].lng.max, fixed:6})
                        };
                    }
                }else if(criterion.type == "list"){
                    if(criterion.liststyle == "stars"){
                        newHotel[criterion.id] = chance.integer({min: 1, max: 5});
                    }else{
                        newHotel[criterion.id] = {};
                        _.each(criterion.options, function(option){
                            newHotel[criterion.id][option.id] = chance.bool();
                        });
                    }
                }
            });

            this.hotelsList.push(newHotel);
        }
    },

    //recherche des hôtels correspondants aux critères
    searchHotels:function(criteriaParams){
        var self = this;

        console.log("searchHotels", criteriaParams);

        _.each(this.hotelsList, function(hotel){
            hotel.matchingCoeff = 0;
            hotel.matchingCriteria = [];

            _.each(criteriaParams, function(criterion, indexCriterion){
                if(indexCriterion == "localisation"){
                    if(criterion.target_value == hotel.localisation){
                        hotel.matchingCoeff += (100 * (criterion.importance/10));
                        hotel.matchingCriteria.push("localisation");
                    }
                }else if(indexCriterion == "categorie"){
                    var confortDiff = Math.abs((hotel.categorie - parseInt(criterion.target_value, 10)));
                    if(confortDiff === 0){
                        hotel.matchingCoeff += (50 * (criterion.importance/10));
                        hotel.matchingCriteria.push("categorie");
                    }else if(confortDiff == 1){
                        hotel.matchingCoeff += (10 * (criterion.importance/10));
                    }else if(confortDiff == 2){
                        hotel.matchingCoeff += (5 * (criterion.importance/10));
                    }
                }else if(indexCriterion == "tarifmin"){
                    var intPrice = parseInt(criterion.target_value, 10);
                    var priceDiff = Math.abs((hotel.tarifmin - intPrice));
                    if(hotel.tarifmin <= intPrice){
                        hotel.matchingCoeff += (50 * (criterion.importance/10));
                        hotel.matchingCriteria.push("tarifmin");
                    }else if(priceDiff < 20){
                        hotel.matchingCoeff += (10 * (criterion.importance/10));
                    }else if(priceDiff < 50){
                        hotel.matchingCoeff += (5 * (criterion.importance/10));
                    }
                }else{
                    //_.each(criterion.options, function(option){
                        if(hotel[criterion.parent][criterion]){
                            hotel.matchingCoeff += (20 * (criterion.importance/10));
                            hotel.matchingCriteria.push(criterion);
                        }
                    //});
                }
            });
        });

        var sortedMatchingHotels = _.sortBy(this.hotelsList, function(h){ return -h.matchingCoeff; });
        var matchingHotels = sortedMatchingHotels.slice(0, Math.round(30 + Math.random()*20));
        console.log("matchingHotels", matchingHotels);
        return matchingHotels;
    }
});

//App.fakeAPI.generateHotels()
//$("#FakeAPITextarea").val(JSON.stringify(App.fakeAPI.hotelsList))