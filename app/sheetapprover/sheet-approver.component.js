(function(){
    "use strict";
    var module = angular.module("QMCUtilities")


    function fetchTableHeaders($http){
        return $http.get("data/tableDef.json")
        .then(function(response)
        {
            return response.data;
        });
    }

    function fetchTableRows($http)
    {
        //return $http.get('/qmcutils/getSheets')
        return $http.get("data/testData.json")
        .then(function(response)
        {
            return response.data;
        });
    }


    function sheetBodyController($http)
    {
        var model = this;
        var colNames = [];
        model.columnNames= [];

        model.rows = []

        model.$onInit = function() {
            fetchTableHeaders($http).then(function(table)
            {
                model.columnNames = table.columns;
            })
            .then(function()
            {
                fetchTableRows($http).then(function(response)
                {
                    model.tableRows = response.rows;
                }); 
                return null;
            });
        };
    }

    function controller(){
        var model = this;

        model.supportClick = function()
        {
            alert("I'm a button!");
        };

        model.$onInit = function(){
            model.message = "I AM THE SHEET APPROVER";
        };
    }

    

    module.component("sheetApprover", {
        templateUrl:"app/sheetapprover/sheet-approver.component.html",
        controllerAs: "model",
        controller: [controller]
    });

    module.component("supportStatement", {
        templateUrl:"app/sheetapprover/support-statement.component.html" 
    });

    module.component("sheetApproverBody", {
        templateUrl:"app/sheetapprover/sheet-approver-body.html",
        controllerAs: "model",
        controller: ["$http", sheetBodyController]
    });

}());