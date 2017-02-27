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
        "confort":{
            "id":"confort",
            "label":"Niveau de confort *",
            "tuileLabel":"Nombre d'étoiles",
            "type":"list",
            "liststyle":"stars",
            "options":[{id:1, label:"1 étoile", featured:true}, {id:2, label:"2 étoiles", featured:true}, {id:3, label:"3 étoiles", featured:true}, {id:4, label:"4 étoiles", featured:true}, {id:5, label:"5 étoiles", featured:true}],
            "homeProCol":1,
            "homePersoCol":1,
            "modalCol":1
        },
        "price":{
            "id":"price",
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
                { value:"Paris", label:"Paris (75000)"},
                { value:"Marseille", label:"Marseille (13000)"},
                { value:"Bordeaux", label:"Bordeaux (33000)"},
                { value:"Lyon", label:"Lyon (69000)"},
                { value:"Toulouse", label:"Toulouse (31000)"},
                { value:"Lille", label:"Lille (59000)"},
                { value:"Nantes", label:"Nantes (44000)"},
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
            "options":[{id:"cable", label:"Câble satellite", featured:true}, {id:"canalplus", label:"Canal+", featured:true}, {id:"clim", label:"Climatisation", featured:false}, {id:"coffre", label:"Coffre", featured:false}, {id:"kitchenette", label:"Kitchenette", featured:false}, {id:"dvd", label:"Lecteur DVD", featured:false}, {id:"terrasse-privative", label:"Terrasse privative", featured:false}, {id:"telephone", label:"Téléphone", featured:false}, {id:"television", label:"Télévision", featured:false}],
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
            "options":[{id:"pmr", label:"Accès PMR", featured:true}, {id:"animaux", label:"Animaux", featured:true}, {id:"cb", label:"Automate CB", featured:false}, {id:"groupe", label:"Groupe accepté", featured:false}, {id:"ecolabel", label:"Écolabel européen", featured:false}, {id:"clef-verte", label:"Label la clef verte", featured:false}, {id:"qualitay", label:"Label qualité toursime", featured:false}, {id:"groupemenents", label:"Label groupements", featured:false}, {id:"handicap", label:"Label tourisme handicap", featured:false}, {id:"nb-pmr", label:"Nombre de chambre PMR", featured:false}, {id:"nb-communicant", label:"Nombre de chambre familliales communicantes", featured:false}, {id:"nb-couverts", label:"Nombre de couverts Hôtel/restaurant", featured:false}, {id:"nb-reunion", label:"Nombre de salle de réunion", featured:false}, {id:"nb-chambres", label:"Nombre total de chambres", featured:false}, {id:"parking-autocar", label:"Parking autocars", featured:false}, {id:"restaurant-accessible", label:"Restaurant accessible", featured:false}, {id:"troglodytique", label:"Troglodytique", featured:false}, {id:"type-equipement", label:"Type d'équipement", featured:false}, {id:"veilleur", label:"Veilleur de nuit", featured:false}],
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
            "options":[{id:"coffre", label:"Coffres clients", featured:false}, {id:"garderie", label:"Garderie", featured:false}, {id:"internet", label:"Internet", featured:false}, {id:"location-velo", label:"Location de vélos", featured:false}, {id:"bebe", label:"Matériel pour bébé", featured:false}, {id:"navette", label:"Navette gare/aéroport", featured:false}, {id:"room-service", label:"Room service", featured:false}, {id:"wifi", label:"WiFi", featured:false}, {id:"blanchisserie", label:"Blanchisserie"}],
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
            "options":[{id:"animation", label:"Animation", featured:true}, {id:"equitation", label:"Équitation", featured:true}, {id:"golf", label:"Golf", featured:true}, {id:"peche", label:"Pêche", featured:true}, {id:"remise-en-forme", label:"Remise en forme", featured:true}],
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
            "options":[{id:"carte-bleue", label:"Carte bleue", featured:true}, {id:"cheques", label:"Chèques bancaire/postaux", featured:false}, {id:"cheques-vacances", label:"Chèques vacances", featured:false}, {id:"especes", label:"Espèces", featured:true}, {id:"virements", label:"Virements", featured:false}],
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
            "options":[{id:"allemand", label:"Allemand", featured:true}, {id:"anglais", label:"Anglais", featured:true}, {id:"arabe", label:"Arabe", featured:false}, {id:"chinois", label:"Chinois", featured:false}, {id:"espagnol", label:"Espagnol", featured:false}, {id:"francais", label:"Français", featured:true}, {id:"hongrois", label:"Hongrois", featured:false}, {id:"bresilien", label:"Brésilien", featured:false}, {id:"japonais", label:"Japonais", featured:false}, {id:"italien", label:"Italien", featured:false}, {id:"neerlandais", label:"Néerlandais", featured:false}, {id:"polonais", label:"Polonais", featured:false}, {id:"portugais", label:"Portugais", featured:false}, {id:"roumain", label:"Roumain", featured:false}, {id:"russe", label:"Russe", featured:false}],
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
            "options":[{id:"ascenseur", label:"Ascenseur", featured:false}, {id:"bar", label:"Bar", featured:false}, {id:"garage-a-velo", label:"Garage à vélo", featured:false}, {id:"hammam", label:"Hammam", featured:false}, {id:"jardin", label:"Jardin", featured:true}, {id:"jeux-enfants", label:"Jeux por enfants", featured:false}, {id:"parking-prive", label:"Parking privé", featured:false}, {id:"piscine", label:"Piscine", featured:true}, {id:"restaurant", label:"Restaurant", featured:true}, {id:"salle-reception", label:"Salle de réception", featured:false}, {id:"salle-sport", label:"Salle de sport", featured:false}, {id:"salle-tv", label:"Salle de télévision", featured:false}, {id:"sauna", label:"Sauna", featured:false}, {id:"spa", label:"Spa", featured:true}, {id:"tennis", label:"Tennis", featured:true}, {id:"terrasse", label:"Terrasse", featured:false}],
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

    //retourner le rang avec l'exposant
    renderRanking:function(rank){
        if(rank == 1) return "1<sup>er</sup>";
        else return rank + "<sup>e</sup>";
    }
});

module.exports = Utils;