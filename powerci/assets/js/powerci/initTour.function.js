function initTour(page, confLoader) {
	var tour;
	
	if (page == "powers") {
		tour = new Tour({
			steps: [{
				element: "#tipsMain",
				title: "Tips & tour",
				content: "This area provides some useful tips and facts. You can make it disappear by clicking the close icon and later reset the tips and tour from the \"Settings\" menu."
			}, {
				element: "#customSearchBtn",
				title: "Search profiles",
				placement: "left",
				content: "This menu will allow to create a search profile: define your search criteria and click on \"New profile\" to save your choices. You may later recall a profile or delete unused ones."
			}, {
				element: "#firstBloc",
				title: "Search criteria",
				placement: "bottom",
				content: "This is the crucial interface where you can choose what you wish to search ! Some combinations, like for instance selecting a unique test-case, will allow a \"Compare\" feature. When possible, a blue icon appears that will allow to compute a bargraph to compare the Key Performance Indicator between several boards or kernel configuration for instance."
			}, {
				element: "#tourKPI",
				title: "KEY PERFORMANCE INDICATOR (KPI)",
				placement: "left",
				content: "Here you can select the default KPI to display when showing results. Nevertheless in most charts, you may freely enable/disable any metrics."
			}, {
				element: "#tourTest",
				title: "Test Cases Selection",
				placement: "left",
				content: "You can select one or more tests to search, based on a string search in the test description field. When a single test is selected, a blue button appears on the right: you can now compare all results generated for this very test amongst the other criteria! Try it!"
			}, {
				element: "#compareBtn-test_desc",
				title: "Compare button",
				placement: "left",
				content: "When possible, a blue icon appears that will allow to compute a bargraph to compare the Key Performance Indicator between several boards or kernel configuration for instance."
			}, {
				element: ".myLine:first",
				title: "LATEST RESULT POSTED",
				placement: "top",
				content: "For a given combination of [kernel-branch + config + device] the latest entry in the data base will show up in bold in the list with an arrow pictogram."
			}, {
				element: ".selectReg:first",
				title: "KPI SELECTION FOR PERFORMANCE TREND MONITORING",
				placement: "right",
				content: "Here you may select the metric you wish to monitor over different revisions of the kernel sources tested in the same conditions (kernel config, device)."
			}, {
				element: ".trend:first",
				title: "TREND PICTOGRAM",
				placement: "left",
				content: "This pictogram will show you how this test job compares to its previous execution in the same conditions.<br><br>* Equal: value is unchanged.<br>* Down: value is now lower.<br>* Up : value is now higher.<br>* Dash : first instance of this test, no history yet."
			}, {
				element: ".details:first",
				title: "TEST JOB DETAILS",
				placement: "left",
				content: "This brings you to the detailed view of the selected test job:<br><br>* temporal chart of the power measurements<br>* Performance Metrics trend charts (when this test was run for different kernel builds)<br>* test job details and link to LAVA result bundle."
			}, {
				element: ".details:first",
				title: "TEST JOB DETAILS",
				placement: "left",
				content: "This brings you to the detailed view of the selected test job:<br><br>* temporal chart of the power measurements<br>* Performance Metrics trend charts (when this test was run for different kernel builds)<br>* test job details and link to LAVA result bundle.",
				path: "power_details?id=5704d2aefe87c9bd48bbbbab"
			}, ],
			debug: false,
			backdrop: true
		});

	} else if (page == "powerDetails") {
		tour = new Tour({
			steps: [{
				element: "#staticCntn",
				title: "Report details",
				content: "Here you can find the details about the test configuration and the kernel built under test, as well as other usefull information like to boot time (test execution time)<br><br>Eventually this will also link back to the actual git commit and kernel sources."
			}, {
				element: "#tourLava",
				title: "Lava bundle",
				content: "Since we are using LAVA as the test back-end, you can find details of each unit test and \"dispatcher actions\" following the link to the LAVA result bundle."
			}, {
				element: "#tourPrevious",
				title: "Previous builds",
				content: "Once a test configuration has some history, meaning that it was executed for different version of the kernel sources, a summary of the power stats is listed for each previous build.<br>The typical stats available as drawn from the main supply, are:<br><br>* minimal bus voltage (V)<br>* minimal current (A)<br>* maximal current (A)<br>* average power (W)<br>* max power (W)<br>* energy (instant power X sampling period) (J)<br><br>The color code indicates the trend compared to the previous build.",
				placement: "left"
			}, {
				element: "#dynamic-0",
				title: "MAIN TEMPORAL CHART",
				placement: "top",
				content: "This chart is the temporal display of the power metrics recorded by the Power Probe during the test.<br>You can hide/show the different measurement signals by clicking on their label. You zoom/unzoom areas of the plot through holding the Left Mouse Button down, and precisely read the values under the cursors.<br>Be aware that long duration tests can lead to huge data sets (and longer refresh times) !"
			}, {
				element: ".tourReg:first",
				title: "Regression curves",
				placement: "top",
				content: "For each metric, a regression curve is plotted.<br>The more instances of the test you run, the more points on the curve, to give you the trend of the kernel sources in this configuration, with this target."
			}, ],
			debug: false,
			backdrop: true
		});
	} else {
		throw Exception('Error while loading "' + page + '" tour', false);
	}
	 debug({
		"ref": confLoader,
		"from": "InitTour",
		"lvl1": "Tour plugin loaded succcessfully !",
		"lvl4": function() {
			console.log("Tour plugin loaded succcessfully : ");
			console.log(tour);
			return;	
		}
	});
	return tour;
}