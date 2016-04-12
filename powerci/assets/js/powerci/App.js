function App(pageName) {
	/* Attributes */
	this.instance = null;

	/* Constructor */
	if (pageName == 'powers') {
		this.instance = Powers;
	} else if (pageName == 'powers_details') {
		this.instance = DetailsPowers();
	} else {
		throw new Exception('Error while instantiating App function - Bad page name provided', true);
	}

	/* Methods */
	this.init = function(configFile) {
		try {
			if (this.instance) {
				this.instance.init(configFile); // Init our power/powersDetails instance
				initMenu(this.instance.getTour()); // Init "Settings menu" with tour from instance
				Highcharts.setOptions({lang: {numericSymbols: null}}); // Highcharts feature
			} else
				throw new Exception('Unable to load requested page', true);
		} catch (e) {
			throw e;
		}
	};
	this.launch = function() {
		try {
			this.instance.launch();
		} catch (e) {
			throw e;
		}
	};
	return this;
}