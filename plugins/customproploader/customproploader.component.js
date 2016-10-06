(function(){
    "use strict";
    var module = angular.module("QMCUtilities", ["ngFileUpload", "ngDialog"]);

    function fetchResources($http)
    {
        return $http.get("/plugins/customproploader/data/resources.json")
        .then(function(response)
        {
            return response.data;
        });
    }

    function fetchCustomProps($http)
    {
        return $http.get("/customproploader/getProps")
        .then(function(result)
        {
            return result.data;
        })
    }

    function setExistingResources(customProp, model)
    {
        model.selectedResources = [];
        clearSelectedResources(model);
        model.resourceSelected = true;

        //model.selectedResources.push(customProp.objectTypes);
        customProp.objectTypes.forEach(function(obj)
        {
            model.selectedResources.push(obj);
            document.getElementById(obj).checked = true;
        });
    }

    function clearSelectedResources(model)
    {
        model.resources1.forEach(function(item)
        {
            document.getElementById(item.definition).checked = false;
        });
        model.resources2.forEach(function(item)
        {
            document.getElementById(item.definition).checked = false;
        });
    }

        function setExistingChoiceValues(customProp, model)
    {
        model.propValues=[];
        customProp.choiceValues.forEach(function(value)
        {
            model.propValues.push(value);
        })
        
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

    function updateProp($http, id, resources, values)
    {
        var body = 
        {
            "modifiedDate": buildModDate(),
            "choiceValues": values,
            "objectTypes": resources
        };
        return $http.post("/customproploader/update/" + id, body)
        .then(function(result)
        {
            return result;
        });
    }

    function buildModDate() 
    {
        var d = new Date();
        return d.toISOString();
    }

    function resetForm($http, model)
    {
        model.customPropName = null;
        model.file = [];
        model.propValues=[];
        model.selectedResources= [];
        clearSelectedResources(model);
        document.getElementById("uploadButton").value = null;
        model.validName = false;
        model.resourceSelected =false;
        model.fileUploaded = false;
        model.QRSMessage = "";
        model.propExists = false;
        model.uploadMessage= null;

        fetchCustomProps($http)
        .then(function(customProps)
        {
            customProps.unshift({"name":"Create New Custom Property", "showInput": true});
            model.existingCustomProps = customProps;
            model.existingProps = model.existingCustomProps[0];
            model.required=true;
            model.updateProp = false;
        }); 

    };

    function customPropController($scope, $http, $timeout, ngDialog, Upload)
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
        model.existingCustomProps = [];
        model.existingCustomPropNames = [];
        model.required=true;
        model.updateProp = false;
        model.propExists = false;
        model.uploadMessage= null;
        

        model.$onInit = function()
        {
            fetchResources($http)
            .then(function(table)
            {
                model.resources1 = getResourceColumn(table, 1);
                model.resources2 = getResourceColumn(table, 2); 
            });

            fetchCustomProps($http)
            .then(function(customProps)
            {
                customProps.unshift({"name":"Create New Custom Property", "showInput": true});
                model.existingCustomProps = customProps;
                model.existingProps = model.existingCustomProps[0];
                model.required=true;
                model.updateProp = false;
                model.existingCustomPropNames = model.existingCustomProps.map(function(item) {return item.name});
            });   
        };

        model.getModel = function()
        {
            console.log(model);
        }

        model.selectProp = function()
        {
            if(model.existingProps.showInput)
            {
                model.required=true;
                model.updateProp = false;
                model.customPropName = null;
            }
            else
            {
                model.required=false;
                model.validName = true;
                model.updateProp = true;
                //let's populate what already exists because we will need it for the put
                console.log(model.existingProps);
                setExistingResources(model.existingProps, model);
                setExistingChoiceValues(model.existingProps, model);
                model.customPropName = model.existingProps.name;
                model.propExists=false;

            }
        }

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

            
            
            if(model.existingCustomPropNames.indexOf(model.customPropName) != -1)
            {
                console.log(model.customPropName)
                model.propExists = true;
            }
            else
            {
                model.propExists = false;
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
            console.log(files);
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
                var newItemCount = 0;
                //expose file to ui
                model.file = [];
                model.fileSelected = false;
                model.fileUploaded = true;

                console.log(response);
                response.data.forEach(function(item)
                {
                    //check if it exists in the array already and add only if not there
                    if(model.propValues.indexOf(item)==-1)
                    {
                        model.propValues.push(item);
                        newItemCount += 1;
                    }

                });

                if(newItemCount==0)
                {
                    model.fileUploaded = false;
                    model.uploadMessage = "No new items added to the property list, therefore, updating the custom property is not allowed.  Please add new values or cancel the process.";
                }
                else
                {
                    model.fileUploaded = true;
                     model.uploadMessage = null;
                }

            })
        };

        model.create = function()
        {
            createProp($http, model.customPropName, model.selectedResources, model.propValues)
            .then(function(result)
            {
                model.QRSMessage = result.data;
            })
            .then(function()
            {
                $timeout(function(){resetForm($http,model)}, 3000)
                .then(function()
                {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                    console.log("Form Reset");
                });
            });
        };

        model.update = function()
        {
            updateProp($http, model.existingProps.id, model.selectedResources, model.propValues)
            .then(function(result)
            {
                model.QRSMessage = result.data;
            })
            .then(function()
            {
                $timeout(function(){resetForm($http, model)}, 3000)
                .then(function()
                {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                    console.log("Form Reset");
                });
            });
        }

        model.openHelp = function() {
            ngDialog.open({
                template: "plugins/customproploader/help-dialog.html",
                className: "help-dialog",
                controller: customPropController,
                scope: $scope
            });
        };
    }

    module.component("custompropLoaderBody",
    {
        templateUrl: "plugins/customproploader/customprop-loader-body.html",
        bindings:
        {
            customPropName: "<",
            existingProps: "<"
        },
        controllerAs: "model",
        controller: ["$scope","$http", "$timeout", "ngDialog", "Upload", customPropController]
    });

}());