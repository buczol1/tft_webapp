const functions = {
	checkStatus: (requestBody) => {
		return (requestBody.status);
	},
	isContainedIn: (a, b) => {
	    if (typeof a != typeof b)
	        return false;
	    if (Array.isArray(a) && Array.isArray(b)) {
	        // assuming same order at least
	        for (var i=0, j=0, la=a.length, lb=b.length; i<la && j<lb;j++)
	            if (functions.isContainedIn(a[i], b[j]))
	                i++;
	        return i==la;
	    } else if (Object(a) === a) {
	        for (var p in a)
	            if (!(p in b && functions.isContainedIn(a[p], b[p])))
	                return false;
	        return true;
	    } else
	        return a === b;
	}
}


module.exports = functions;