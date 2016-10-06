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

    function splitTime (val) {
        var splitStr = val.split("T");
        return splitStr[0] + "\n" + splitStr[1];
    };

    function splitText (val, delim) {
        var splitStr = val.split(delim);
        var result = '';
        for (var i = 0; i < splitStr.length; i++) {
            result += splitStr[i] + "\n";
        }
        return result;
    };

    function rulesTableBodyController($scope, $http, ngDialog, Upload) {
        var model = this;
        var colNames = [];
        model.isImported = false;
        model.columnNames = [];
        model.tableRows = [];
        model.outputs = [];
        model.imports = [];
        model.searchRule = '';

        model.file = [];
        model.rules = [];
        model.fileUploaded = false;
        model.fileSelected = false;
        model.importColumnNames = [];
        model.importTableRows = [];

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

        model.setValue = function (isExport, checkme, $index, rule) {
            if (checkme) {
                if (isExport)
                {model.outputs.push(rule);}
                else
                {
                    model.imports.push(rule);
                }
            }
            else {
                if (isExport)
                {
                var index = model.outputs.indexOf(rule);
                model.outputs.splice(index, 1);
                }
                else{
                    var index = model.imports.indexOf(rule);
                   model.imports.splice(index, 1);
                }
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
            return splitTime(val);
        };

        model.splitText = function (val, delim) {
            return splitText(val, delim);
        };

        model.openUpload = function () {
            ngDialog.open({
                template: "plugins/rulemanager/upload-body.html",
                className: "wizard-modal",
                controller: rulesTableBodyController,
                scope: $scope
            });
        };

        model.openImport = function () {
            ngDialog.open({
                template: "plugins/rulemanager/import-dialog.html",
                className: "import-dialog",
                controller: rulesTableBodyController,
                scope: $scope
            });
        };

        model.selectFile = function (files) {
            model.fileSelected = true;
            return model.file = files;
        };

        model.upload = function () {
            Upload.upload({
                url: "/rulemanager/uploadRules",
                data:
                {
                    file: model.file
                },
                arrayKey: ''
            })
            .then(function (response) {
                var newItemCount = 0;
                //expose file to ui
                model.file = [];
                model.fileSelected = false;
                model.fileUploaded = true;

                return model.rules = response.data;

            })
            .then(function(rulesData)
            {
                fetchTableHeaders($http).then(function (table) {
                model.importColumnNames = table.columns;
                })
                .then(function () {
                    model.importTableRows = rulesData;
                });
            });
        };

        model.importRules = function() {
            $http.post('/rulemanager/importRules', JSON.stringify(model.imports))
            .then(function (mapResult) {
                model.imports.forEach(function(element) {
                    var state = mapResult.data.filter(function(result) {return result.id == element.id})[0].state;
                    element.importStatus = state;
                }, this);
                model.importTableRows = model.imports;
                model.isImported = true;
                fetchTableRows($http).then(function (response) {
                    model.tableRows = response.rows;
                });
                setExportColumns();
            })
            .catch(function (error) {
                console.log(error);
            });
        };

        model.openHelp = function() {
            ngDialog.open({
                template: "plugins/rulemanager/help-dialog.html",
                className: "help-dialog",
                controller: rulesTableBodyController,
                scope: $scope
            });
        };

        model.closeDialog = function() {
            ngDialog.closeAll();
            model.imports = [];
            model.importTableRows = [];
            model.isImported = false;
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        };

    }

    module.component("ruleManagerBody", {
        transclude: true,
        templateUrl: "plugins/rulemanager/rule-manager-body.html",
        controllerAs: "tab",
        controller: ["$scope", "$http", "ngDialog", ruleBodyController]
    });

    module.component("rulesTableBody", {
        transclude: true,
        templateUrl: "plugins/rulemanager/rules-table-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", "Upload", rulesTableBodyController]
    });

    // module.component("uploadBody", {
    //     transclude: true,
    //     templateUrl: "plugins/rulemanager/upload-body.html",
    //     controllerAs: "uploadModel",
    //     // controller
    // })




} ());