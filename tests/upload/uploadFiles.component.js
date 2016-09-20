(function(){
    "use strict";
    var module = angular.module("upload", ["ngFileUpload"]);


    function uploadController(Upload)
    {
        var model = this;
        model.hw = "hello World";
        
        model.submit = function()
        {
            console.log(model.file);

            if(model.file)
            {
                model.upload(model.file);
            }
        };
        
        model.upload = function(files)
        {
            console.log("trying to upload");
            console.log(files);
            Upload.upload({
                    url: "http://localhost:8432/upload",
                    data: {
                        file: files
                    },
                    arrayKey:''
                })
                .then(function(resp)
                {
                    console.log(resp.config.data.file.name);
                });
            }
    }

    module.component('uploadFiles',
    {
        templateUrl: 'tests/upload-files.html',
        controllerAs: 'model',
        controller: ["Upload",uploadController]
    })


}());