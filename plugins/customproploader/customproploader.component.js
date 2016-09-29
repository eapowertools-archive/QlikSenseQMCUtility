(function(){
    "use strict";
    var module = angular.module("QMCUtilities", ["ngFileUpload"]);

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

    function createProp($http, name, resources, values)
    {
        var body = 
        {
            "name" : name,
            "valueType": "Text",
            "choiceValues": values,
            "objectTypes": resources
        };
        return $http.post("/customproploader/create", body)
        .then(function(result)
        {
            return result;
        });
    }

    function customPropController($http, Upload)
    {
        var model= this;
        model.resources1 = [];
        model.resources2 = [];
        model.validName = false;
        model.resourceSelected = false;
        model.selectedResources = [];
        model.file = [];
        model.fileSelected = false;
        model.propValues = [];
        model.fileUploaded = false;
        model.QRSMessage = "";
        

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
                model.validName = false;
            }
            else
            {
                model.validName = true;
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

            if(model.selectedResources.length>0)
            {
                model.resourceSelected = true;
            }
            else
            {
                model.resourceSelected = false;
            }
        };

        model.selectFile = function(files)
        {
            model.fileSelected=true;
            return model.file = files;
        };

        model.upload = function()
        {
            Upload.upload({
                url:"/customproploader/upload",
                data:
                {
                    file: model.file
                },
                arrayKey: ''
            })
            .then(function(response)
            {
                //expose file to ui
                model.file = [];
                model.fileSelected = false;
                model.fileUploaded = true;
                console.log(response);
                return model.propValues = response.data;
            })
        };

        model.create = function()
        {
            createProp($http, model.customPropName, model.selectedResources, model.propValues)
            .then(function(result)
            {
                model.QRSMessage = result.data;
            });
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
        controller: ["$http", "Upload", customPropController]
    });

    module.component("supportStatement", {
        templateUrl:"plugins/customproploader/support-statement.component.html" 
    });

}());