module.exports = function(options) {
    return function(req, res, next) {
        options = options || {};
        var fullUrl = req.protocol + "://" + req.headers.host + req.originalUrl.toLowerCase();
        var url = req.originalUrl.toLowerCase();
        var path = req.path.toLowerCase();

        var indexEndBaseUrl = fullUrl.indexOf("/qmcu/");
        var resourceBaseUrl = indexEndBaseUrl > 0 ? fullUrl.substr(0, indexEndBaseUrl) : fullUrl;
        if (resourceBaseUrl.slice(-1) === '/') {
            resourceBaseUrl = resourceBaseUrl.slice(0, resourceBaseUrl.length - 1);
        }

        var pos = resourceBaseUrl.indexOf('/', 9);
        var proxyPath = pos > -1 ? resourceBaseUrl.substr(pos) : '';

        console.log("fullUrl:" + fullUrl);
        console.log("hostname:" + req.hostname);
        console.log("baseUrl:" + req.baseUrl);
        console.log("URL:" + url);
        console.log("PATH:" + path);
        console.log("indexEndBaseUrl:" + indexEndBaseUrl);
        console.log("resourceBaseUrl:" + resourceBaseUrl);
        console.log("pos:" + pos);
        console.log("proxyPath:" + proxyPath);
        console.log("proxyPath Length: " + proxyPath.length);
        req.proxyPath = proxyPath;
        req.redirectUrl = fullUrl;


        next();
    }
}