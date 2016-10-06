(function () {
    "use strict";
    var module = angular.module("QMCUtilities", ["ngDialog"])

    function fetchTableHeaders($http) {
        return $http.get("/sheetapprover/data/tableDef.json")
            .then(function (response) {
                return response.data;
            });
    }

    function fetchTableRows($http) {
        return $http.get('/sheetapprover/getSheets')
            //return $http.get("data/testData.json")
            .then(function (response) {
                return response.data;
            });
    }

    function approveSheets($http, sheets) {
        console.log('running approveSheets');
        var sheetIds = sheets.map(function(sheet) { return sheet['sheetId']; });
        return $http.post('/sheetapprover/approveSheets', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function unapproveSheets($http, sheets) {
        var sheetIds = sheets.map(function(sheet) { return sheet['sheetId']; });
        return $http.post('/sheetapprover/unapproveSheets', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function sheetBodyController($scope, $http, ngDialog) {
        var model = this;
        var colNames = [];
        model.columnNames = [];
        model.tableRows = []
        model.outputs = [];
        model.searchSheets = '';


        model.$onInit = function () {
            fetchTableHeaders($http).then(function (table) {
                    model.columnNames = table.columns;
                })
                .then(function () {
                    fetchTableRows($http).then(function (response) {
                        model.tableRows = response.rows;
                        for (var index = 0; index < model.tableRows.length; index++) {
                            model.tableRows[index].unshift(false);
                        }
                    });
                });
        };

        model.highlight = function (string, searchString) {
            console.log(string);
            console.log(searchString);
            /* if(!searchString)
             {
                 //$sce.trustAsHtml(string);
             }
             return $sce.trustAsHtml(string.replace(new RegExp(searchString, "gi"), function(match)
             {
                 return '<span class="lui-texthighlight">' + match + '</span>'
             })) */
        }

        model.approveButtonValid = function () {
            for (var index = 0; index < model.outputs.length; index++) {
                if (model.outputs[index]['approvedState'] == "Not approved") {
                    return true;
                }
            }
            return false;
        }

        model.unapproveButtonValid = function () {
            for (var index = 0; index < model.outputs.length; index++) {
                if (model.outputs[index]['approvedState'] == "Approved") {
                    return true;
                }
            }
            return false;
        }

        model.setValue = function (isChecked, sheetId, approvedState) {
            if (isChecked) {
                model.outputs.push({'sheetId': sheetId, 'approvedState': approvedState});
            } else {
                var index = model.outputs.indexOf({'sheetId': sheetId, 'approvedState': approvedState});
                model.outputs.splice(index, 1);
            }
            console.log(model.outputs);
        };

        function handleApproveUnapproveResponse(response) {
            console.log(response);
            if (response.data.success) {
                model.outputs = [];
                response.data.items.forEach(function (item) {
                    model.tableRows.forEach(function (row, index) {
                        row[0] = false;
                        if (item.id == row[8]) {
                            if (item.approved == true) {
                                model.tableRows[index][3] = "Approved";
                            } else if (item.approved == false) {
                                model.tableRows[index][3] = "Not approved";
                            }
                        }
                    });
                });
            }
        }

        model.approve = function () {
            approveSheets($http, model.outputs)
                .then(function (response) {
                    handleApproveUnapproveResponse(response);
                    return;
                }).then(function () {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                });;
        };

        model.unapprove = function () {
            unapproveSheets($http, model.outputs)
                .then(function (response) {
                    handleApproveUnapproveResponse(response);
                    return;
                }).then(function () {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                });
        };

        model.openHelp = function () {
            ngDialog.open({
                template: "plugins/sheetapprover/help-dialog.html",
                className: "help-dialog",
                controller: sheetBodyController,
                scope: $scope
            });
        };
    }

    module.component("sheetApproverBody", {
        transclude: true,
        templateUrl: "plugins/sheetapprover/sheet-approver-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", "ngDialog", sheetBodyController]
    });

    module.filter('highlight', function () {
        return function (text, search) {
            if (text && search) {
                text = text.toString();
                search = search.toString();
                return text.replace(new RegExp(search, 'gi'), '<span class="lui-texthighlight">$&</span>');
            } else {
                return text;
            }

        }

    });

}());