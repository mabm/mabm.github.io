var PowerDetails = {
	confLoader : ConfLoader,

	init: function() {
		var me = this;

		try {
			this.confLoader.load(configFile).done(function() {
				me.tour = initTour('powers'); // Init powers tour
				showTips('#tipsMain'); // Call function which will show or not tips by reading SessionStorage
				me.tour.init(); // Init tour AFTER "showTips"
				me.manageTips();
				me.manageGUI(); // Hide/show elments into DOM and trigger click/change ..
				me.profilManager.displayProfils();
			}); // Load JSON config file - Promise returned
		} catch (e) {
			throw e;
		}
	},
	launch: function() {

	}
}