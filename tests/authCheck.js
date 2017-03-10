var config = require("../config/config");
var cookie = require('./getVPCookieNames');

//first things first, start the middleware
function working()
{
    return function isAuthenticated(req, res, next)
    {
        //first need to check the path for the first element.
        var path = req.path.split("/");
        console.log(path);

        //now check to see if there is a cookie that matches the


    }
}





// var userInfo = require('./testGetUserFromSession');

// function isAuthenticated()
// {
// 	return function isAuthenticated(req, res, next) 
// 	{
// 		var prefix;
// 		var cookieName;
// 		var cookieCheckInfo;

// 		return cookie.cookieNames()
// 		.then(function(result)
// 		{
// 		    return result;
// 		})
// 		.then(function(cookieArray)
// 		{
// 	        //capture the path and evaluate against the virtual proxy array.
// 	        //set some booleans that can be used in some 
// 	        // console.log("URL:" + req.baseUrl);
// 	        // console.log("PATH:" + req.path);
// //	        console.log(req.cookies);

// 			//console.log(req.cookies);
// 			console.log(getCookie(req.cookies,cookieArray));
			
// 			var wholesomeCookie = getCookie(req.cookies,cookieArray);
// 			if(wholesomeCookie.length ==0)
// 			{
// 				//no cookie matches
// 				//go get one.
// 				//check prefix
// 				console.log(req.path);
// 				next();
// 			}
// /*
// 			if(existsPrefix(req.path, cookieArray))
// 			{
// 				prefix = getPrefix(req.path, cookieArray)[0].prefix;
// 				console.log(prefix);
// 				return next();
// 			}
// 			else
// 			{
// 				console.log("prefix not found")
// 				return next();
// 			}
// /*	        cookieCheckInfo = getCookie(req.cookies,cookieArray);

// 	        if(cookieCheckInfo.length ==0)
// 	        {
// 	        	//I need to check for a prefix

// 	        }
// 	        console.log(cookieCheckInfo);
	    
// 	        cookieName = cookieCheckInfo[0].sessionCookieHeaderName
// 	        prefix = cookieCheckInfo[0].prefix
	        
// 	        //so if everything exists, I'm just going to pass you through
// 	        if(cookieExists(req.cookies,cookieName))
// 	        {
// 	        	//get the userInfo and set some request info
// 				return userInfo.checkUser(prefix, req.cookies[cookieName])
// 				.then(function(credential)
// 				{
// 					req.user = {
// 						"userDirectory": credential.UserDirectory,
// 						"userId": credential.UserId,
// 						"isAuthenticated": true
// 					};

// 					return next();
// 				})
// 				.catch(function(error)
// 				{
// 					console.log(error);
// 					return next();
// 				});
// 	        }
// 	        else
// 	        {
// 		        return res.redirect(req.protocol + "://" + req.hostname + 
// 	            (prefix == undefined || prefix.length==0 ? "": "/" + prefix) + "/content/default/qmcutils.html");  
// 	        }
// 	*/
// 	    });


// 	}
// }


// module.exports = isAuthenticated;








// function getCookie(reqCookies, cookieArray)
// {
// 	return cookieArray.filter(function(cookie)
// 	{
// 		for(var key in reqCookies)
// 		{
			
// 			if(key === cookie.sessionCookieHeaderName)
// 			{
// 				return true;
// 			}
// 		}
// 	});
// }

// function cookieExists(cookies, cookieName)
// {
//     if(cookieName !==undefined)
//     {
//         for(var key in cookies)
//         {
//             if(key === cookieName)
//             {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

// function existsPrefix(path, cookieArray)
// {
// 	return cookieArray.filter(function(cookie)
// 	{
// 		return path.includes(cookie.prefix);
// 	});
// }

// function getPrefix(path, cookieArray)
// {
// 	return cookieArray.filter(function(cookie)
// 	{
// 		return path.includes(cookie.prefix);
// 	});
// }