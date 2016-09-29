(function(){
    "use strict";
    var module = angular.module("QMCUtilities");

    function fetchResources($http)
    {
        return $http.get("/plugins/customproploader/data/resources.json")
        .then(function(response)
        {
            return response.data;
        });
    }

    function getResourceColumn(array, column)
    {
        return array.filter(function(arrayItem)
        {
            return arrayItem.column == column;
        });
    }

    function customPropController($http)
    {
        var model= this;
        model.resources1 = [];
        model.resources2 = [];
        model.invalidName = false;
        model.resourceSelected = false;
        model.selectedResources = [];


        model.$onInit = function()
        {
            fetchResources($http)
            .then(function(table)
            {
                model.resources1 = getResourceColumn(table, 1);
                model.resources2 = getResourceColumn(table, 2); 
            });
        };

        model.validateName = function()
        {
            if(!model.customPropName.match(/^\S\w*$/))
            {
                model.invalidName = true;
            }
            else
            {
                model.invalidName = false;
            }
        };

        model.checkedResources = function(value)
        {
            if(document.getElementById(value).checked === true)
            {
                model.selectedResources.push(value);
            }
            else
            {
                var indexx = model.selectedResources.indexOf(value);
                model.selectedResources.splice(indexx,1);
            }

            if(this.selectedResources.length>0)
            {
                this.resourceSelected = true;
            }
            else
            {
                this.resourceSelected = false;
            }
        };

    }

    module.component("custompropLoaderBody",
    {
        templateUrl: "plugins/customproploader/customprop-loader-body.html",
        bindings:
        {
            customPropName: "<"
        },
        controllerAs: "model",
        controller: ["$http", customPropController]
    });

    module.component("supportStatement", {
        templateUrl:"plugins/customproploader/support-statement.component.html" 
    });

}());