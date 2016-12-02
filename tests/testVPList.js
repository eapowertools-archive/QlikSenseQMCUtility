var cookie = require('./getVPCookieNames');

cookie.cookieNames()
.then(function(result)
{
    console.log(result);
});

