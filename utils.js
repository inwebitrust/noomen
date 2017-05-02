'use strict';

/*
Class Utils :
contient toutes les infos statiques nécessaires à la génération des villes et critères
contient les fonctions partagées utilisées par différentes vues du projet
*/

var Utils = Backbone.View.extend({
    citiesParams:{
        "france":{
            lat:{ center:46.227638, min:48.819235, max:48.901000 },
            lng:{ center:2.213749, min:2.264042, max:2.414417 }
        },
        "paris":{
            lat:{ center:48.856614, min:48.819235, max:48.901000 },
            lng:{ center:2.352222, min:2.264042, max:2.414417 }
        },
        "lyon":{
            lat:{ center:45.764043, min:45.751886, max:45.785415 },
            lng:{ center:4.835659, min:4.809952, max:4.809952 }
        },
        "bordeaux":{
            lat:{ center:44.837789, min:44.812950, max:44.873077 },
            lng:{ center:-0.579180, min:-0.632744, max:-0.524940 }
        },
        "marseille":{
            lat:{ center:43.296482, min:43.215904, max:43.389799 },
            lng:{ center:5.369780, min:5.298157, max:5.528870 }
        },
        "lille":{
            lat:{ center:50.629250, min:50.619349, max:50.643739 },
            lng:{ center:3.057256, min:3.038406, max:3.080292 }
        },
        "toulouse":{
            lat:{ center:43.604652, min:43.596395, max:43.614295 },
            lng:{ center:1.444209, min:1.432514, max:1.454659 }
        },
        "nantes":{
            lat:{ center:47.218371, min:47.177316, max:47.267786 },
            lng:{ center:-1.553621, min:-1.643143, max:-1.471481 }
        }
    },

    criteria:{
        "categorie":{
            "id":"categorie",
            "label":"Niveau de confort *",
            "tuileLabel":"Nombre d'étoiles",
            "type":"list",
            "liststyle":"stars",
            "options":[{id:1, label:"1 étoile", featured:true}, {id:2, label:"2 étoiles", featured:true}, {id:3, label:"3 étoiles", featured:true}, {id:4, label:"4 étoiles", featured:true}, {id:5, label:"5 étoiles", featured:true}],
            "homeProCol":1,
            "homePersoCol":1,
            "modalCol":1
        },
        "tarifmin":{
            "id":"tarifmin",
            "label":"Prix souhaité <br />pour une nuit *",
            "tuileLabel":"Tarif max",
            "type":"input",
            "placeholder":"Montant en euro",
            "inputtype":"free",
            "inputHTMLType":"number",
            "homeProCol":2,
            "homePersoCol":2,
            "modalCol":1
        },
        "localisation":{
            "id":"localisation",
            "label":"Localisation *",
            "tuileLabel":"Localisation",
            "type":"input",
            "inputtype":"autocomplete",
            "inputHTMLType":"text",
            "autocompletelist":[
                { value:"Paris", label:"Paris (75000)", id:"paris"},
                { value:"Marseille", label:"Marseille (13000)", id:"marseille"},
                { value:"Bordeaux", label:"Bordeaux (33000)", id:"bordeaux"},
                { value:"Lyon", label:"Lyon (69000)", id:"lyon"},
                { value:"Toulouse", label:"Toulouse (31000)", id:"toulouse"},
                { value:"Lille", label:"Lille (59000)", id:"lille"},
                { value:"Nantes", label:"Nantes (44000)", id:"nantes"},
            ],
            "placeholder":"Ville ou code postal",
            "homeProCol":2,
            "homePersoCol":2,
            "modalCol":1
        },
        "optionsconfort":{
            "id":"optionsconfort",
            "label":"Options de confort",
            "tuileLabel":"Confort",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"confort_cable_satellite", label:"Câble satellite", featured:true}, {id:"confort_canal_+", label:"Canal+", featured:true}, {id:"confort_climatisation", label:"Climatisation", featured:false}, {id:"confort_coffre", label:"Coffre", featured:false}, {id:"confort_kitchenette", label:"Kitchenette", featured:false}, {id:"confort_lecteur_dvd", label:"Lecteur DVD", featured:false}, {id:"confort_terrasse_privative", label:"Terrasse privative", featured:false}, {id:"confort_telephone", label:"Téléphone", featured:false}, {id:"confort_television", label:"Télévision", featured:false}],
            "homeProCol":0,
            "homePersoCol":0,
            "modalCol":2
        },
        "options":{
            "id":"options",
            "label":"Options",
            "tuileLabel":"Options",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"accespmr", label:"Accès PMR", featured:true}, {id:"animauxacceptes", label:"Animaux", featured:true}, {id:"automatecb", label:"Automate CB", featured:false}, {id:"groupeaccepte", label:"Groupe accepté", featured:false}, {id:"label_ecolabel_europeen", label:"Écolabel européen", featured:false}, {id:"label_la_clef_verte", label:"Label la clef verte", featured:false}, {id:"label_qualite_tourisme", label:"Label qualité toursime", featured:false}, {id:"labelsgroupements", label:"Label groupements", featured:false}, {id:"labeltourismehandicap", label:"Label tourisme handicap", featured:false}, {id:"nbrechambrepmr", label:"Nombre de chambre PMR", featured:false}, {id:"nbrechambresfamilialescommunicantes", label:"Nombre de chambre familliales communicantes", featured:false}, {id:"nbredecouvertshotelrestau", label:"Nombre de couverts Hôtel/restaurant", featured:false}, {id:"nbresallereunion", label:"Nombre de salle de réunion", featured:false}, {id:"nbretotaldechambre", label:"Nombre total de chambres", featured:false}, {id:"ouvertureaccueil", label:"Ouverture Accueil", featured:false}, {id:"parkingautocars", label:"Parking autocars", featured:false}, {id:"restaurantaccessible", label:"Restaurant accessible", featured:false}, {id:"troglodytique", label:"Troglodytique", featured:false}, {id:"typeequipement", label:"Type d'équipement", featured:false}, {id:"veilleurnuit", label:"Veilleur de nuit", featured:false}],
            "homeProCol":0,
            "homePersoCol":0,
            "modalCol":2
        },
        "services":{
            "id":"services",
            "label":"Services",
            "tuileLabel":"Services",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"services_coffres_clients", label:"Coffres clients", featured:false}, {id:"services_garderie", label:"Garderie", featured:false}, {id:"services_internet", label:"Internet", featured:false}, {id:"services_location_de_velos", label:"Location de vélos", featured:false}, {id:"services_materiel_bebe", label:"Matériel pour bébé", featured:false}, {id:"services_navette_gare_aeroport", label:"Navette gare/aéroport", featured:false}, {id:"services_service_en_chambre", label:"Room service", featured:false}, {id:"services_wifi", label:"WiFi", featured:false}, {id:"services_blanchisserie", label:"Blanchisserie"}],
            "homeProCol":0,
            "homePersoCol":0,
            "modalCol":3
        },
        "activities":{
            "id":"activities",
            "label":"Activités sur place",
            "tuileLabel":"Activités",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"activitessurplace_animation", label:"Animation", featured:true}, {id:"activitessurplace_equitation", label:"Équitation", featured:true}, {id:"activitessurplace_golf", label:"Golf", featured:true}, {id:"activitessurplace_peche", label:"Pêche", featured:true}, {id:"activitessurplace_remise_en_forme", label:"Remise en forme", featured:true}],
            "homeProCol":3,
            "homePersoCol":3,
            "modalCol":3
        },
        "paiement":{
            "id":"paiement",
            "label":"Modes de paiement",
            "tuileLabel":"Paiement",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"modespaiement_american_express", label:"American Express", featured:false}, {id:"modespaiement_carte_bleue", label:"Carte bleue", featured:true}, {id:"modespaiement_cheques_bancaires_et_postaux", label:"Chèques bancaire/postaux", featured:false}, {id:"modespaiement_cheques_vacances", label:"Chèques vacances", featured:false}, {id:"modespaiement_espece", label:"Espèces", featured:true}, {id:"modespaiement_virements", label:"Virements", featured:false}],
            "homeProCol":0,
            "homePersoCol":0,
            "modalCol":3
        },
        "langues":{
            "id":"langues",
            "label":"Langues",
            "tuileLabel":"Langue",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"languesparlees_allemand", label:"Allemand", featured:true}, {id:"languesparlees_anglais", label:"Anglais", featured:true}, {id:"languesparlees_arabe", label:"Arabe", featured:false}, {id:"languesparlees_chinois", label:"Chinois", featured:false}, {id:"languesparlees_espagnol", label:"Espagnol", featured:false}, {id:"languesparlees_francais", label:"Français", featured:true}, {id:"languesparlees_hongrois", label:"Hongrois", featured:false}, {id:"languesparlees_bresilien", label:"Brésilien", featured:false}, {id:"languesparlees_japonais", label:"Japonais", featured:false}, {id:"languesparlees_italien", label:"Italien", featured:false}, {id:"languesparlees_neerlandais", label:"Néerlandais", featured:false}, {id:"languesparlees_polonais", label:"Polonais", featured:false}, {id:"languesparlees_portugais", label:"Portugais", featured:false}, {id:"languesparlees_roumain", label:"Roumain", featured:false}, {id:"languesparlees_russe", label:"Russe", featured:false}, {id:"languesparlees_coreen", label:"Coréen", featured:false}, {id:"languesparlees_tcheque", label:"Tchèque", featured:false}],
            "homeProCol":0,
            "homePersoCol":0,
            "modalCol":3
        },
        "accessto":{
            "id":"accessto",
            "label":"Accès à",
            "tuileLabel":"Accès",
            "type":"list",
            "liststyle":"checkbox",
            "options":[{id:"equipements_ascenseur", label:"Ascenseur", featured:false}, {id:"equipements_bar", label:"Bar", featured:false}, {id:"equipements_garage_a_velo", label:"Garage à vélo", featured:false}, {id:"equipements_hammam", label:"Hammam", featured:false}, {id:"equipements_jardin", label:"Jardin", featured:true}, {id:"equipements_jeux_pour_enfants", label:"Jeux por enfants", featured:false}, {id:"equipements_parking_prive", label:"Parking privé", featured:false}, {id:"equipements_piscine", label:"Piscine", featured:true}, {id:"equipements_restaurant", label:"Restaurant", featured:true}, {id:"equipements_salle_de_reception", label:"Salle de réception", featured:false}, {id:"equipements_salle_de_sport", label:"Salle de sport", featured:false}, {id:"equipements_salon_de_television", label:"Salon de télévision", featured:false}, {id:"equipements_sauna", label:"Sauna", featured:false}, {id:"equipements_spa", label:"Spa", featured:true}, {id:"equipements_tennis", label:"Tennis", featured:true}, {id:"equipements_terrasse", label:"Terrasse", featured:false}],
            "homeProCol":4,
            "homePersoCol":4,
            "modalCol":4
        }
    },

    initialize:function(){
        this.autocompleteCriteriaList = [];
        this.populateUtils();
    },

    //création de la liste de critères pour le champ de recherche autocomplété
    populateUtils:function(){
        var self = this;
        _.each(this.criteria, function(criterion, index){
            //self.autocompleteCriteriaList.push(criterion.label);
            if(criterion.options !== undefined && criterion.liststyle == "checkbox"){
                _.each(criterion.options, function(option){
                    self.autocompleteCriteriaList.push({
                        id:option.id,
                        label:option.label
                    });
                });
            }
        });
    },

    getApiParams:function(criteriaParams, criteriaWeightParams, latlng){
        var apiParams = {};
        _.each(criteriaWeightParams, function(criteriaData, criteriaID){
            apiParams[criteriaID] = {
                id:criteriaID,
                target_value:1,
                parent:criteriaData.parent,
                importance:criteriaData.weight
            };
            if(criteriaID == "tarifmin" || criteriaID == "localisation" || criteriaID == "categorie"){
                apiParams[criteriaID].target_value = criteriaParams[criteriaID].value;
            }
            if(criteriaID == "localisation"){
                if(App.utils.citiesParams[criteriaParams[criteriaID].value] !== undefined){
                    apiParams[criteriaID].lat = App.utils.citiesParams[criteriaParams[criteriaID].value].lat.center;
                    apiParams[criteriaID].lng = App.utils.citiesParams[criteriaParams[criteriaID].value].lng.center;
                }
                if(latlng !== undefined){
                    apiParams[criteriaID].lat = latlng.lat;
                    apiParams[criteriaID].lng = latlng.lng;
                }
            }
        });
        return apiParams;
    },

    //retourner le rang avec l'exposant
    renderRanking:function(rank){
        if(rank == 1) return "1<sup>er</sup>";
        else return rank + "<sup>e</sup>";
    }
});