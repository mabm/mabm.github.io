var ConfLoader = {
	/* Attributes */
    apiToken : "",
    lavaBaseURL : null,
    apiURL : "",

    /* Init method */
    load : function(file) {
    	var me = this;

    	var promise = $.ajax({
							method: "GET",
							url: file,
							async: false
						});

    	promise.done(function(data) {
			if (data.apiToken)
				me.apiToken = data.apiToken;
			else
				throw new Exception("Token API (apiToken) not found into config file.");
			if (data.lavaBaseURL)
				me.lavaBaseURL = data.lavaBaseURL;
			else
				throw new Exception("Lava URL (lavaBaseURL) not found into config file.");
			if (data.apiURL)
				me.apiURL = data.apiURL;
			else
				throw new Exception("API URL (apiURL) not found into config file.");
    	}).fail(function() {
    		throw new Exception("File '"+file+"' not found.");
    	});

    	return (promise);
    },

    /* Methods */
    getApiToken : function () {
        return this.apiToken;
    },
    getLavaBaseURL : function () {
        return this.lavaBaseURL;
    },
    getApiURL : function () {
        return this.apiURL;
    }
}