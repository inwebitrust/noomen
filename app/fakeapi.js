'use strict';

//App.fakeAPI.generateHotels()
//$("#FakeAPITextarea").val(JSON.stringify(App.fakeAPI.hotelsList))

var FakeAPI = Backbone.View.extend({
    initialize:function(){
        this.hotelsList = [];
        this.nbHotels = 500;
        this.maxSearchHotels = 30;
    },

    gatherData:function(){
        var self = this;
        $.getJSON("data/hotels.json", function(data){
            self.hotelsList = data;
            App.start();
        });
    },

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
                    if(criterion.id == "price"){
                        newHotel[criterion.id] = chance.integer({min: 20, max: 500});
                    }
                    else if(criterion.id == "localisation"){
                        var cityID = _.sample(criterion.autocompletelist);
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

    searchHotels:function(criteriaParams, weightParams){
        var self = this;

        _.each(this.hotelsList, function(hotel){
            hotel.matchingCoeff = 0;
            hotel.matchingCriteria = [];

            _.each(criteriaParams, function(criterion, indexCriterion){
                if(indexCriterion == "localisation"){
                    if(criterion.value == hotel.localisation){
                        hotel.matchingCoeff += (100 * (weightParams[indexCriterion].weight/10));
                        hotel.matchingCriteria.push("localisation");
                    }
                }else if(indexCriterion == "confort"){
                    var confortDiff = Math.abs((hotel.confort - parseInt(criterion.value, 10)));
                    if(confortDiff === 0){
                        hotel.matchingCoeff += (50 * (weightParams[indexCriterion].weight/10));
                        hotel.matchingCriteria.push("confort");
                    }else if(confortDiff == 1){
                        hotel.matchingCoeff += (10 * (weightParams[indexCriterion].weight/10));
                    }else if(confortDiff == 2){
                        hotel.matchingCoeff += (5 * (weightParams[indexCriterion].weight/10));
                    }
                }else if(indexCriterion == "price"){
                    var intPrice = parseInt(criterion.value, 10);
                    var priceDiff = Math.abs((hotel.price - intPrice));
                    if(hotel.price <= intPrice){
                        hotel.matchingCoeff += (50 * (weightParams[indexCriterion].weight/10));
                        hotel.matchingCriteria.push("price");
                    }else if(priceDiff < 20){
                        hotel.matchingCoeff += (10 * (weightParams[indexCriterion].weight/10));
                    }else if(priceDiff < 50){
                        hotel.matchingCoeff += (5 * (weightParams[indexCriterion].weight/10));
                    }
                }else{
                    _.each(criterion.options, function(option){
                        if(hotel[indexCriterion][option]){
                            hotel.matchingCoeff += (20 * (weightParams[option].weight/10));
                            hotel.matchingCriteria.push(option);
                        }
                    });
                }
            });
        });

        var sortedMatchingHotels = _.sortBy(this.hotelsList, function(h){ return -h.matchingCoeff; });
        return sortedMatchingHotels.slice(0, Math.round(30 + Math.random()*20));
    }
});

module.exports = FakeAPI;