(function () {
    "use strict";
    var module = angular.module("QMCUtilities")


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

    function approveSheets($http, sheetIds) {
        console.log('running approveSheets');
        return $http.post('/sheetapprover/approveSheets', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function unapproveSheets($http, sheetIds) {
        return $http.post('/sheetapprover/unapproveSheets', sheetIds)
            .then(function (response) {
                return response;
            });
    }

    function sheetBodyController($scope, $http) {
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

        function rowIdMatch(row) {
            if (model.outputs.indexOf(row[7]) != -1) {
                return true;
            }
        }

        model.approveButtonValid = function () {
            var selectedRows = model.tableRows.filter(rowIdMatch);
            for (var index = 0; index < selectedRows.length; index++) {
                if (selectedRows[index][2] == "Not approved") {
                    return true;
                }
            }
            return false;
        }

        model.unapproveButtonValid = function () {
            var selectedRows = model.tableRows.filter(rowIdMatch);
            for (var index = 0; index < selectedRows.length; index++) {
                if (selectedRows[index][2] == "Approved") {
                    return true;
                }
            }
            return false;
        }

        model.checkme = function (checkme) {
            if (checkme) {
                return true;
            } else {
                return false;
            }
        }

        model.getWidth = function () {
            $(".th-column").each(function () {
                console.log($(this).css('width'));
            });
        };

        model.setValue = function (checkme, $index, sheetId) {
            if (checkme) {
                model.outputs.push(sheetId);
            } else {
                var index = model.outputs.indexOf(sheetId);
                model.outputs.splice(index, 1);
            }
            console.log(model.outputs);
        };

        model.approve = function () {
            approveSheets($http, model.outputs)
                .then(function (response) {
                    console.log(response);
                    if (response.data.success) {
                        $('.approveUnapprove').prop('checked', false);
                        model.outputs = [];
                        response.data.items.forEach(function (item) {
                            model.tableRows.forEach(function (row, index) {
                                if (item.id == row[7]) {
                                    if (item.approved == true) {
                                        model.tableRows[index][2] = "Approved";
                                    } else if (item.approved == false) {
                                        model.tableRows[index][2] = "Not approved";
                                    }
                                    // model.checkme(false);
                                }
                            });
                        });
                    }
                    return;
                }).then(function() {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                });;
        };

        model.unapprove = function () {
            unapproveSheets($http, model.outputs)
                .then(function (response) {
                    console.log(response);
                    if (response.data.success) {
                        $('.approveUnapprove').prop('checked', false);
                        model.outputs = [];
                        response.data.items.forEach(function (item) {
                            model.tableRows.forEach(function (row, index) {
                                if (item.id == row[7]) {
                                    if (item.approved == true) {
                                        model.tableRows[index][2] = "Approved";
                                    } else if (item.approved == false) {
                                        model.tableRows[index][2] = "Not approved";
                                    }
                                }
                            });
                        });
                    }
                    return;
                }).then(function() {
                    $scope.form.$setPristine();
                    $scope.form.$setUntouched();
                });
        };

    }

    function controller() {
        var model = this;

        model.supportClick = function () {
            alert("I'm a button!");
        };

        model.$onInit = function () {
            model.message = "I AM THE SHEET APPROVER";
        };
    }

    module.component("supportStatement", {
        templateUrl: "plugins/sheetapprover/support-statement.component.html"
    });

    module.component("sheetApproverBody", {
        transclude: true,

        templateUrl: "plugins/sheetapprover/sheet-approver-body.html",
        controllerAs: "model",
        controller: ["$scope", "$http", sheetBodyController]
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