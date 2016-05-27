var ConfLoader = {
    /* Attributes */
    apiToken: null,
    lavaBaseURL: null,
    apiURL: null,
    storageURL: null,
    appVersion: null,

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
    }
}