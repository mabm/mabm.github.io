function App(pageName) {
	/* Attributes */
	this.instance = null;

	/* Constructor */
	if (pageName == 'powers') {
		this.instance = Powers; // Load Powers Module
	} else if (pageName == 'powers_details') {
		this.instance = PowerDetails; // Load PowerDetails Module
	} else {
		throw new Exception('Error while instantiating App function - Bad page name provided', true);
	}

	/* Methods */
	this.init = function(configFile) {
		try {
			if (this.instance) {
				this.instance.init(configFile); // Init our power/powersDetails instance
				initMenu(this.instance.getTour()); // Init "Settings menu" with tour from instance
				Highcharts.setOptions({
					lang: {
						numericSymbols: null
					},
					credits: {
						enabled: true,
						position: {
							align: 'left',
							x: 10,
							verticalAlign: 'bottom',
							y: 0
						},
						href: "http://www.baylibre.com",
						text: "Baylibre"
					},
				}); // Highcharts feature
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