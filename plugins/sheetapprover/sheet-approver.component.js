(function(){
    "use strict";
    var module = angular.module("QMCUtilities")


    function fetchTableHeaders($http){
        return $http.get("/sheetapprover/data/tableDef.json")
        .then(function(response)
        {
            return response.data;
        });
    }

    function fetchTableRows($http)
    {
        return $http.get('/sheetapprover/getSheets')
        //return $http.get("data/testData.json")
        .then(function(response)
        {
            return response.data;
        });
    }

    function approveSheets($http, sheetIds)
    {
        console.log('running approveSheets');
        return $http.post('/sheetapprover/approveSheets', sheetIds)
        .then(function(response)
        {
            return response;
        });
    }

    function unapproveSheets($http, sheetIds)
    {
        return $http.post('/sheetapprover/unapproveSheets',sheetIds)
        .then(function(response)
        {
            return response;
        });
    }

    function sheetBodyController($http)
    {
        var model = this;
        var colNames = [];
        model.columnNames= [];
        model.tableRows = []
        model.outputs = [];
        model.searchSheets = '';


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
            });
        };

        model.checkme = function(checkme)
        {
            if(checkme)
            {
               return true;
            }
            else
            {
                return false;
            }
        }

        model.getWidth = function(){
            $(".th-column").each(function()
            {
                console.log($(this).css('width'));
            });
        };

        model.setValue = function(checkme, $index, sheetId)
        {
            if(checkme)
            {
                model.outputs.push(sheetId);
            }
            else
            {
                var index = model.outputs.indexOf(sheetId);
                model.outputs.splice(index,1);
            }
            console.log(model.outputs);
        };

        model.approve = function()
        {
            approveSheets($http, model.outputs)
            .then(function(response)
            {
                console.log(response);
                if(response.data.success)
                {
                    $('.approveUnapprove').prop('checked', false);
                    model.outputs = [];
                    response.data.items.forEach(function(item)
                    {
                        model.tableRows.forEach(function(row, index)
                        {
                            if(item.id==row[7])
                            {
                                model.tableRows[index][2] = item.approved;
                               // model.checkme(false);

                            }
                        });
                    });
                }
            });
        };

        model.unapprove = function()
        {
            unapproveSheets($http, model.outputs)
            .then(function(response)
            {
                console.log(response);
                if(response.data.success)
                {
                    $('.approveUnapprove').prop('checked', false);
                    model.outputs = [];
                    response.data.items.forEach(function(item)
                    {
                        model.tableRows.forEach(function(row, index)
                        {
                            if(item.id==row[7])
                            {
                                model.tableRows[index][2] = item.approved;   
                            }
                        });
                    });
                }
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

    module.component("supportStatement", {
        templateUrl:"plugins/sheetapprover/support-statement.component.html" 
    });

    module.component("sheetApproverBody", {
        transclude: true,
    
        templateUrl:"plugins/sheetapprover/sheet-approver-body.html",
        controllerAs: "model",
        controller: ["$http", sheetBodyController]
    });
   

}());