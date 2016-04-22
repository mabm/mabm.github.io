var ConfLoader = {
    /* Attributes */
    apiToken: null,
    lavaBaseURL: null,
    apiURL: null,
    storageURL: null,
    appVersion: null,
    debug: false,

    /* Init method */
    load: function(file) {
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
            if (data.storageURL)
                me.storageURL = data.storageURL;
            else
                throw new Exception("Storage URL (storageURL) not found into config file.");
            if (data.appVersion)
                me.appVersion = data.appVersion;
            else
                throw new Exception("App Version (appVersion) not found into config file.");
            if (data.debugLevel)
                me.debugLevel = data.debugLevel;
            else
                throw new Exception("Debug Level (debugLevel) not found into config file.");
            debug({
                "ref": me,
                "from": "ConfLoader",
                "lvl1": "Config file loaded successfully",
                "lvl2": function() {
                    var output = "Config file loaded successfully :\n\n";

                    output += "- Token API : " + me.apiToken;  
                    output += "\n- LAVA URL : " + me.lavaBaseURL;
                    output += "\n- API URL : " + me.apiURL;
                    output += "\n- Storage URL : " + me.storageURL;
                    output += "\n- App version : " + me.appVersion;
                    output += "\n- Debug level : " + me.debugLevel;                  
                    return (output);
                }
            });
        }).fail(function() {
            throw new Exception("File '" + file + "' not found.");
        });

        return (promise);
    },

    /* Methods */
    getApiToken: function() {
        return this.apiToken;
    },
    getLavaBaseURL: function() {
        return this.lavaBaseURL;
    },
    getApiURL: function() {
        return this.apiURL;
    },
    getStorageURL: function() {
        return this.storageURL;
    },
    getAppVersion: function() {
        return this.appVersion;
    },
    getDebugLevel: function() {
        return this.debugLevel;
    }
}