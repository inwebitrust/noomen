var AppRouter = Backbone.Router.extend({

    routes: {
        "":"routeFromURL",
        ":page":"routeFromURL",
    },

    routeFromURL:function(page){
        if(page === undefined || page === null) page = "home";

        App.selectedPage = page;
        App.updateFromRouter();
    },
    
    updateRoute:function(triggerize){
        this.navigate("#"+App.selectedPage, {trigger: triggerize});
    },

});