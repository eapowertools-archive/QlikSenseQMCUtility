(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngFileUpload", "ngDialog"]);



    function fetchTableHeaders($http) {
        return $http.get("/rulemanager/data/tableDef.json")
            .then(function (response) {
                return response.data;
            });
    }

    function fetchTableRows($http) {
        return $http.get('/rulemanager/getRules')
            //return $http.get("data/testData.json")
            .then(function (response) {
                return response.data;
            });
    }

    function exportRules($http, ruleIds) {
        return $http.post('/rulemanager/exportRules', ruleIds)
            .success(function (data, status, headers, config) {
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: 'data:attachment/octet-stream;charset=utf-8,' + encodeURI(JSON.stringify(data, null, '\t')),
                    target: '_self',
                    download: 'rules.json'
                })[0].click();
            })
            .error(function (data, status, headers, config) {
                console.log(status);
            });
        /*        return $http.post('/rulemanager/exportRules', ruleIds)
                .then(function(response)
                {
                    return response;
                }); */
    }

    function convertActionBin(val) {
        var x = parseInt(val, 10);
        var bin = x.toString(2);
        var binArray = bin.split("");
        var strArray = ["Create", "Read", "Update", "Delete", "Export", "Publish",
            "Change owner", "Change role", "Export data"];
        var resultArray = [];
        for (var i = 0; i < binArray.length; i++) {
            binArray[i] === "1" ? resultArray.push(strArray[i]) : false;
        }
        return resultArray;
    }

    function ruleBodyController($http) {
        var tab = this;
        tab.tab = 1;

        tab.setTab = function (tabId) {
            tab.tab = tabId;
        };

        tab.isSet = function (tabId) {
            return tab.tab === tabId;
        };
    }

    function setExportColumns() {
        var i = 0;

        $("colgroup").each(function () {

            i++;

            $(this).attr("id", "col" + i);

        });

        var totalCols = i;

        i = 1;

        $("td").each(function () {

            $(this).attr("rel", "col" + i);

            i++;

            if (i > totalCols) { i = 1; }

        });

        $("td").hover(function () {

            $(this).parent().addClass("hover");
            var curCol = $(this).attr("rel");
            $("#" + curCol).addClass("hover");

        }, function () {

            $(this).parent().removeClass("hover");
            var curCol = $(this).attr("rel");
            $("#" + curCol).removeClass("hover");

        });
    }

    function exportBodyController($http) {
        var model = this;
        var colNames = [];
        model.columnNames = [];
        model.tableRows = [];
        model.outputs = [];
        model.searchRule = '';

        model.$onInit = function () {
            fetchTableHeaders($http).then(function (table) {
                model.columnNames = table.columns;
            })
                .then(function () {
                    fetchTableRows($http).then(function (response) {
                        model.tableRows = response.rows;
                    });
                });
            setExportColumns();
        };

        model.exportrules = function () {
            exportRules($http, model.outputs)
                .then(function (response) {

                    model.outputs = [];
                    console.log(response);
                })
                .then(function () {
                    $(".selectItem").prop('checked', false);
                });
        }

        model.setValue = function (checkme, $index, ruleId) {
            if (checkme) {
                model.outputs.push(ruleId);
            }
            else {
                var index = model.outputs.indexOf(ruleId);
                model.outputs.splice(index, 1);
            }
            console.log(model.outputs);
        };

        model.checkme = function (checkme) {
            if (checkme) {
                return true;
            }
            else {
                return false;
            }
        }

        model.getWidth = function () {
            $(".th-column").each(function () {
                console.log($(this).css('width'));
            });
        };

        model.actionConverter = function (val) {
            return convertActionBin(val);
        };

        model.splitTime = function (val) {
            var splitStr = val.split("T");
            return splitStr[0] + "\n" + splitStr[1];
        };

        model.splitText = function (val, delim) {
            var splitStr = val.split(delim);
            var result = '';
            for (var i = 0; i < splitStr.length; i++) {
                result += splitStr[i] + "\n";
            }
            return result;
        };

    }

    function importBodyController($scope, Upload, ngDialog) 
    {
         var importModel = this;
         importModel.file = [];
         importModel.rules = [];
         importModel.fileUploaded = false;
         importModel.fileSelected = false;
         
        

         importModel.selectFile = function(files)
        {
            console.log("FileSelected");
            console.log(files)
            importModel.fileSelected=true;
            return importModel.file = files;
        };

        importModel.upload = function()
        {
            console.log("hello world");
            console.log(Upload);
            Upload.upload({
                url:"/rulemanager/uploadRules",
                data:
                {
                    file: importModel.file
                },
                arrayKey: ''
            })
            .then(function(response)
            {
                var newItemCount = 0;
                //expose file to ui
                importModel.file = [];
                importModel.fileSelected = false;
                importModel.fileUploaded = true;

                console.log(response);
                return response;
            });
        };
        
         importModel.openUpload = function()
         {
             ngDialog.open({
                template: "plugins/rulemanager/upload-body.html",
                className: "wizard-modal",
                controller: importBodyController,
                scope: $scope
            });
         };
    };

    /* module.component("supportStatement", {
         templateUrl:"plugins/rulemanager/support-statement.component.html" 
     }); */

    module.component("ruleManagerBody", {
        transclude: true,

        templateUrl: "plugins/rulemanager/rule-manager-body.html",
        controllerAs: "tab",
        controller: ["$http", ruleBodyController]
    });

    module.component("exportBody", {
        transclude: true,
        templateUrl: "plugins/rulemanager/export-body.html",
        controllerAs: "model",
        controller: ["$http", exportBodyController]
    });

    module.component("importBody", {
        transclude: true,
        templateUrl: "plugins/rulemanager/import-body.html",
        controllerAs: "importModel",
        controller: ["$scope", "$http", "ngDialog", "Upload", importBodyController]
    });

    // module.component("uploadBody", {
    //     transclude: true,
    //     templateUrl: "plugins/rulemanager/upload-body.html",
    //     controllerAs: "uploadModel",
    //     // controller
    // })

    


} ());