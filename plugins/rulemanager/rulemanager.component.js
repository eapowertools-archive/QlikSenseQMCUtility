(function () {
    "use strict";
    var module = angular.module("QMCUtilities");



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

    function importBodyController(Upload) {
        var importModel = this;

        importModel.submit = function () {
            if (importModel.form.file.$valid && importModel.file) {
                importModel.upload(importModel.file);
            }
        };

        importModel.$watch('files', function () {
        importModel.upload(importModel.files);
    });
    importModel.$watch('file', function () {
        if (importModel.file != null) {
            importModel.files = [importModel.file]; 
        }
    });
    importModel.log = '';

    importModel.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (!file.$error) {
                Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    data: {
                      username: importModel.username,
                      file: file  
                    }
                }).then(function (resp) {
                    $timeout(function() {
                        importModel.log = 'file: ' +
                        resp.config.data.file.name +
                        ', Response: ' + JSON.stringify(resp.data) +
                        '\n' + importModel.log;
                    });
                }, null, function (evt) {
                    var progressPercentage = parseInt(100.0 *
                    		evt.loaded / evt.total);
                    importModel.log = 'progress: ' + progressPercentage + 
                    	'% ' + evt.config.data.file.name + '\n' + 
                      importModel.log;
                });
              }
            }
        }
    };

    }
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
        controller: ["$http", importBodyController]
    });



} ());